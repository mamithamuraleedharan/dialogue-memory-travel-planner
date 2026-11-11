
#!/usr/bin/env bash

set -o pipefail

RUNS=5
TEMPERATURE="0"

mkdir -p results

TIMESTAMP=$(date +"%Y%m%d-%H%M%S")

for DATASET in paris rome spain; do

    LOG_FILE="results/${DATASET}-temp${TEMPERATURE}-${TIMESTAMP}.txt"
    CSV_FILE="results/${DATASET}-temp${TEMPERATURE}-${TIMESTAMP}.csv"

    echo "dataset,strategy,trial,accuracy,duration_seconds,status" > "$CSV_FILE"
    echo "Experiment: $DATASET, Temperature: $TEMPERATURE" > "$LOG_FILE"

    echo "===================================="
    echo "DATASET: $DATASET"
    echo "===================================="

    for strategy in FullHistory Summary Sisu; do

        echo "Running $strategy..."
        strategy_start=$SECONDS

        for ((i=1; i<=RUNS; i++)); do

            echo "Run $i" | tee -a "$LOG_FILE"

            start=$SECONDS
            temp_file=$(mktemp)

            DATASET="$DATASET" npx tsx "experiments/run${strategy}.ts" > "$temp_file" 2>&1
            exit_code=$?

            duration=$((SECONDS - start))

            cat "$temp_file" >> "$LOG_FILE"

            accuracy=$(awk '/Overall Accuracy:/ {
                gsub(/%/, "", $3);
                value=$3
            } END {print value}' "$temp_file")

            if [[ $exit_code -eq 0 && -n "$accuracy" ]]; then
                status="success"
                echo "$DATASET,$strategy,$i,$accuracy,$duration,$status" >> "$CSV_FILE"
                echo "$strategy Run $i: $accuracy% (${duration}s)" | tee -a "$LOG_FILE"
            else
                status="failed"
                echo "$DATASET,$strategy,$i,,$duration,$status" >> "$CSV_FILE"
                echo "$strategy Run $i: FAILED (${duration}s)" | tee -a "$LOG_FILE"
            fi

            rm "$temp_file"
        done

        strategy_duration=$((SECONDS - strategy_start))

        average_duration=$(awk -v total="$strategy_duration" \
            -v runs="$RUNS" 'BEGIN {printf "%.2f", total/runs}')

        echo "-----------------------------------" | tee -a "$LOG_FILE"
        echo "$strategy timing summary:" | tee -a "$LOG_FILE"
        echo "Total time: ${strategy_duration}s" | tee -a "$LOG_FILE"
        echo "Average per run: ${average_duration}s" | tee -a "$LOG_FILE"
        echo "-----------------------------------" | tee -a "$LOG_FILE"
    done

    echo "MEAN ACCURACY — $DATASET" | tee -a "$LOG_FILE"

    awk -F, '
    NR > 1 && $6 == "success" {
        sum[$2] += $4
        count[$2]++
    }
    END {
        for (strategy in count) {
            printf "%s: %.2f%% (%d successful runs)\n",
                strategy, sum[strategy]/count[strategy], count[strategy]
        }
    }' "$CSV_FILE" | tee -a "$LOG_FILE"

done

echo "All experiments completed!"
