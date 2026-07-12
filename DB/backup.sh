#!/bin/bash
set -euo pipefail

# Load env safely
set -o allexport
source "$(dirname "$0")/.env"
set +o allexport

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

DAILY_DIR="$BACKUP_ROOT/daily"
WEEKLY_DIR="$BACKUP_ROOT/weekly"
MONTHLY_DIR="$BACKUP_ROOT/monthly"
COUNTER_FILE="$BACKUP_ROOT/counter.txt"

mkdir -p "$DAILY_DIR" "$WEEKLY_DIR" "$MONTHLY_DIR"

DAILY_FILE="$DAILY_DIR/$TIMESTAMP.sql.gz"

echo "Starting backup..."

if docker exec -i "$CONTAINER" \
    pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > "$DAILY_FILE"
then
    echo "Backup created: $DAILY_FILE"
else
    echo "Backup failed!"
    exit 1
fi

# Handle counter safely
COUNT=0
if [[ -f "$COUNTER_FILE" ]]; then
    COUNT=$(cat "$COUNTER_FILE")
fi

COUNT=$((COUNT + 1))
echo "$COUNT" > "$COUNTER_FILE"

# Weekly backup every 7 days
if (( COUNT % 7 == 0 )); then
    WEEK_NUM=$((COUNT / 7))
    cp "$DAILY_FILE" "$WEEKLY_DIR/week_$WEEK_NUM.sql.gz"
    echo "Weekly backup: week_$WEEK_NUM.sql.gz"
fi

# Monthly backup every 28 days
if (( COUNT % 28 == 0 )); then
    MONTH_NUM=$((COUNT / 28))
    cp "$DAILY_FILE" "$MONTHLY_DIR/month_$MONTH_NUM.sql.gz"
    echo "Monthly backup: month_$MONTH_NUM.sql.gz"
fi

# Keep only:
# 7 daily
# 4 weekly
# 12 monthly

find "$DAILY_DIR" -type f -printf '%T@ %p\n' | sort -nr | tail -n +8 | cut -d' ' -f2- | xargs -r rm -f
find "$WEEKLY_DIR" -type f -printf '%T@ %p\n' | sort -nr | tail -n +5 | cut -d' ' -f2- | xargs -r rm -f
find "$MONTHLY_DIR" -type f -printf '%T@ %p\n' | sort -nr | tail -n +13 | cut -d' ' -f2- | xargs -r rm -f

echo "Backup rotation complete."
