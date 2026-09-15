package worker

import (
	"runtime"
	"testing"

	"backend-test/internal/generator"
)

const benchSize = 10_000_000

// b.Loop (Go 1.24+) times only the loop body, so the slice generation above
// it is excluded from the measurement automatically.

func BenchmarkSequential(b *testing.B) {
	data := generator.GenerateLargeSlice(benchSize)
	for b.Loop() {
		SumEvenSequential(data)
	}
}

func BenchmarkConcurrent(b *testing.B) {
	data := generator.GenerateLargeSlice(benchSize)
	workers := runtime.NumCPU()
	for b.Loop() {
		SumEvenConcurrent(data, workers)
	}
}
