# JRMA Field Guide

Offline phone app for JRMA patient care: step-by-step protocol flow, questions to ask, time-stamped interventions and vitals, field-impression prompts, a MIST handoff report for the receiving RN, and a pre-arrival report the crew can email-to-fax to the ED 5-10 minutes out ([setup](docs/how-to/set-up-mch-fax.md)).

**Status: all protocol content is UNVERIFIED.** The NH Patient Care Protocols v9.3 text is not yet loaded. Follow the official protocols. See `docs/how-to/verify-a-protocol.md`.

```bash
npm test            # 10 tests, no dependencies
npm run validate    # protocol graph check
npm run serve       # http://localhost:8080
```

Docs: [tutorial](docs/tutorials/first-call.md) · [how-to](docs/how-to/) · [reference](docs/reference/protocol-schema.md) · [explanation](docs/explanation/safety-model.md) · [decisions](docs/adr/)
