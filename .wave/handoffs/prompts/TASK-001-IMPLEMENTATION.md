# TASK-001 implementation

- Backend service separates mutable metadata from append-only complete content versions. Owner-scoped reads and transactional CAS writes return conflict metadata without private text.
- Database engineer adds ordered 0002 migration and Prompt/Version/URL Source schema, compound ownership constraints and immutable-history protection. Future job/plan/skill tables do not exist; nullable provenance integration waits for those actual tables without manufacturing historical jobs.
- Authenticated HTTP adapters use trusted requireOwner, same-origin writes, strict bounded JSON validation, safe response envelopes and no external requests. This task omits list/search/duplicate/archive/trial/cover/reuse/UI behavior.
- Validate with disposable SQLite migrations, history, owner boundaries, rollback and CAS races; then actual typecheck/lint/tests/build. No real database or .env operations.
