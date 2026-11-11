
# Lost in Conversation
### Comparing Memory Strategies in Multi-Turn Conversations

This project explores how different memory strategies affect the retention and correction of user requirements in multi-turn dialogues.

A travel planning scenario is used to compare three memory strategies using Llama 3.1 through Ollama.

## Memory Strategies

- **Full History:** Uses the complete conversation to extract the final travel requirements.
- **Rolling Summary:** Maintains an updated summary throughout the conversation.
- **SISU-Based Memory:** Uses LLM-based dialogue-move recognition and Information State update rules to maintain structured requirements.

## Datasets

Three travel-planning dialogues were used:

| Dataset | Turns | Description |
|---------|-------|-------------|
| Paris | 19 | Short synthetic dialogue |
| Rome | 50 | Long synthetic dialogue  |
| Spain | 79 | Human - AI conversation |

## Technologies

- TypeScript 
- Llama 3.1 


## Project Structure

```text

├── data/                 # Travel-planning dialogue datasets
├── src/
│   ├── dialogue/         # SISU implementation and dialogue types
│   ├── llm/              # Ollama connection and requirement extraction
│   └── memory/           # Full history and Summary memory implementation
├── experiments/
│   ├── runFullHistory.ts # Full History experiment
│   ├── runSummary.ts     # Rolling Summary experiment
│   ├── runSisu.ts        # SISU experiment
│   └── evaluate.ts      # Accuracy evaluation
├── results/
│   ├── analysis.ipynb    # Results analysis notebook
│   ├── others            # Experiment results

```

## Running the Experiments


Run an individual experiment:

```bash
DATASET=paris npx tsx experiments/runFullHistory.ts
DATASET=paris npx tsx experiments/runSummary.ts
DATASET=paris npx tsx experiments/runSisu.ts
```

Replace `paris` with `rome` or `spain` to test other datasets.

## Results

Full History achieved the highest or joint highest accuracy across all three datasets.

Rolling Summary performed well on the synthetic dialogues, while the simplified SISU implementation faced challenges with dialogue-move interpretation and memory updates.

Detailed experiment results and visualizations are available in the `results/` directory.

## Reference

Laban et al., *LLMs Get Lost in Multi-Turn Conversation* 

---

