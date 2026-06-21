import json

transcript_path = "/Users/abhishekpratapsingh/.gemini/antigravity-ide/brain/7fade298-ac1e-41ce-9644-06a57f41a15c/.system_generated/logs/transcript.jsonl"
steps = []
with open(transcript_path, "r") as f:
    for line in f:
        steps.append(json.loads(line))

print(f"Total steps: {len(steps)}")
# Let's search from the end for the first step of type BROWSER_SUBAGENT
for i in range(len(steps) - 1, -1, -1):
    step = steps[i]
    if step.get("type") == "BROWSER_SUBAGENT":
        print(f"Found BROWSER_SUBAGENT step at index {i}, step_index {step.get('step_index')}:")
        print(step.get("content"))
        print("="*80)
        break
