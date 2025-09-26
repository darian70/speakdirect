from __future__ import annotations

try:
    from temporalio import workflow
except Exception:
    workflow = None  # type: ignore

if workflow:
    @workflow.defn
    class ExampleWorkflow:
        @workflow.run
        async def run(self, name: str) -> str:
            return f"Hello, {name}! (Temporal)"

if __name__ == "__main__":
    try:
        from observability import init_observability
        init_observability("temporal-workflows")
    except Exception:
        pass
    print("Temporal starter ready. Run via a worker to execute workflows.")
