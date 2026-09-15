[← Back to main README](../README.md)

# Concurrent Even Sum

Sums the even numbers of a 10,000,000-element `[]int` using one goroutine per CPU core
(`runtime.NumCPU()`), a buffered channel for results, and `sync.WaitGroup` for shutdown.

## Requirements

Go 1.26+. No external dependencies.

## Commands

```bash
go run ./cmd/counting-using-goroutine  # run the program
go build ./...                         # build all packages
go test ./...                          # unit tests
go test -short ./...                   # skip the 10M-element test
go test -race ./...                    # tests with the race detector
go test -run='^$' -bench=. ./internal/worker -benchmem  # sequential vs concurrent benchmark
go vet ./...                           # static checks
```

## Expected output

Total sum of even numbers: `25000005000000` (= 5,000,000 × 5,000,001).

## Layout

Follows [golang-standards/project-layout](https://github.com/golang-standards/project-layout):

| Path | Responsibility |
|---|---|
| `cmd/counting-using-goroutine/main.go` | entrypoint: detects CPUs, generates data, times and prints the result |
| `internal/generator/` | builds the input slice `1..n` with one allocation |
| `internal/worker/` | worker, concurrent orchestrator, sequential baseline |
| `internal/worker/*_test.go` | correctness tests (closed-form oracle) and benchmarks |

## Design notes

- **Workers = `runtime.NumCPU()`**, clamped to the data length. No over-threading.
- **Chunking:** `len/N` per worker; the last worker takes the remainder so no element is skipped.
- **No shared state:** each worker sums into a local variable and sends one value on a buffered
  channel (capacity N). There are no mutexes and no data races.
- **Shutdown:** a goroutine runs `wg.Wait()` and then `close(results)`, which ends the `range` over results.
- **`int64` sums:** the answer exceeds the 32-bit range, so it stays correct on 32-bit builds too.

## Benchmark (my machine: Apple M3 Pro, 11 cores)

| Benchmark | ns/op |
|---|---|
| Sequential | 5,370,864 |
| Concurrent | 967,058 |
