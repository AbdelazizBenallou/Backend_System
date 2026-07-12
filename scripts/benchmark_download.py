#!/usr/bin/env python3
"""
Benchmark: simulate 100 concurrent users downloading a file.
Measures RTT, throughput, and error rate for each request.
"""

import asyncio
import time
import sys
import json
import statistics

BASE_URL = "http://192.168.0.167"
CONCURRENT = 100
FILE_ID = 9  # the 5MB video file

async def login(session, aiohttp):
    data = {"email": "admin@email.com", "password": "Admin@12345"}
    async with session.post(f"{BASE_URL}/v1/auth/login", json=data) as resp:
        body = await resp.json()
        return body["data"]["accessToken"]

async def download_one(session, token, idx):
    headers = {"Authorization": f"Bearer {token}"}
    start = time.monotonic()
    try:
        async with session.get(
            f"{BASE_URL}/v1/files/{FILE_ID}/download?disposition=attachment",
            headers=headers,
            timeout=aiohttp.ClientTimeout(total=300)
        ) as resp:
            data = await resp.read()
            elapsed = time.monotonic() - start
            return {
                "idx": idx,
                "status": resp.status,
                "size": len(data),
                "rtt": round(elapsed, 3),
                "error": None,
            }
    except Exception as e:
        elapsed = time.monotonic() - start
        return {
            "idx": idx,
            "status": 0,
            "size": 0,
            "rtt": round(elapsed, 3),
            "error": str(e),
        }

async def main():
    import aiohttp

    connector = aiohttp.TCPConnector(limit=CONCURRENT, limit_per_host=CONCURRENT)
    async with aiohttp.ClientSession(connector=connector) as session:
        print(f"[*] Logging in...")
        token = await login(session, aiohttp)
        print(f"[*] Token obtained. Starting {CONCURRENT} concurrent downloads...")

        tasks = [download_one(session, token, i) for i in range(CONCURRENT)]
        start = time.monotonic()

        results = await asyncio.gather(*tasks)

        total_time = time.monotonic() - start

    # Stats
    rtts = [r["rtt"] for r in results if r["error"] is None]
    errors = [r for r in results if r["error"] is not None]
    statuses = [r["status"] for r in results if r["error"] is None]
    sizes = [r["size"] for r in results if r["error"] is None]

    total_bytes = sum(sizes)
    throughput_mbps = round((total_bytes * 8) / total_time / 1_000_000, 2)

    print(f"\n{'='*60}")
    print(f" BENCHMARK RESULTS — {CONCURRENT} concurrent downloads")
    print(f"{'='*60}")
    print(f" Total time:         {total_time:.2f}s")
    print(f" Successful:         {len(rtts)}/{CONCURRENT}")
    print(f" Errors:             {len(errors)}")
    print(f" Total data:         {total_bytes / 1_000_000:.2f} MB")
    print(f" Throughput:         {throughput_mbps} Mbps")
    print(f" Status codes:       {', '.join(f'{s}({statuses.count(s)})' for s in set(statuses))}")

    if rtts:
        print(f"\n RTT (seconds):")
        print(f"   Min:    {min(rtts):.3f}s")
        print(f"   Max:    {max(rtts):.3f}s")
        print(f"   Avg:    {statistics.mean(rtts):.3f}s")
        print(f"   Median: {statistics.median(rtts):.3f}s")
        print(f"   Stdev:  {statistics.stdev(rtts):.3f}s" if len(rtts) > 1 else "")

    if errors:
        print(f"\n Errors:")
        for e in errors[:5]:
            print(f"   #{e['idx']}: {e['error']}")

    print(f"\n{'='*60}")

    # Save raw results
    with open("/tmp/benchmark_results.json", "w") as f:
        json.dump(results, f, indent=2)
    print(f"[*] Raw results saved to /tmp/benchmark_results.json")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        FILE_ID = int(sys.argv[1])
    if len(sys.argv) > 2:
        CONCURRENT = int(sys.argv[2])

    try:
        import aiohttp
    except ImportError:
        print("[!] Installing aiohttp...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "aiohttp", "-q"])
        import aiohttp

    asyncio.run(main())
