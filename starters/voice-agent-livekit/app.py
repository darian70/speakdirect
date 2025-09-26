try:
    from livekit.agents import WorkerOptions, cli
except Exception:
    WorkerOptions = None
    cli = None

try:
    from observability import init_observability
except Exception:
    def init_observability(_: str) -> None:  # type: ignore
        pass

if __name__ == "__main__":
    if WorkerOptions is None:
        print("Install livekit-agents to run this starter")
    else:
        # In real usage, define tasks and pipelines; see LiveKit examples
        init_observability("voice-agent-livekit")
        cli.run(WorkerOptions())
