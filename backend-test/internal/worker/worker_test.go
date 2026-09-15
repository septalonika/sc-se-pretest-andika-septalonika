package worker

import (
	"testing"

	"backend-test/internal/generator"
)

// evenSumFormula is an independent oracle: the sum of even numbers in 1..n
// is m*(m+1) where m = n/2. Example: n=10 -> 2+4+6+8+10 = 30 = 5*6.
func evenSumFormula(n int) int64 {
	m := int64(n / 2)
	return m * (m + 1)
}

var sizes = []int{1, 2, 10, 101, 1_000_000}

func TestSumEvenSequentialMatchesFormula(t *testing.T) {
	for _, n := range sizes {
		got := SumEvenSequential(generator.GenerateLargeSlice(n))
		if want := evenSumFormula(n); got != want {
			t.Errorf("n=%d: got %d, want %d", n, got, want)
		}
	}
}

func TestSumEvenConcurrentMatchesSequential(t *testing.T) {
	for _, n := range sizes {
		data := generator.GenerateLargeSlice(n)
		got := SumEvenConcurrent(data, 4)
		if want := SumEvenSequential(data); got != want {
			t.Errorf("n=%d: got %d, want %d", n, got, want)
		}
	}
}

// Correctness must not depend on the worker count. Odd counts like 3 and 7
// leave a remainder, so this is the test that catches a broken last chunk.
func TestSumEvenConcurrentAnyWorkerCount(t *testing.T) {
	const n = 1_000_003
	data := generator.GenerateLargeSlice(n)
	want := evenSumFormula(n)

	for _, workers := range []int{1, 2, 3, 7, 64} {
		if got := SumEvenConcurrent(data, workers); got != want {
			t.Errorf("workers=%d: got %d, want %d", workers, got, want)
		}
	}
}

func TestSumEvenConcurrentMoreWorkersThanData(t *testing.T) {
	data := []int{1, 2, 3}
	if got := SumEvenConcurrent(data, 64); got != 2 {
		t.Errorf("got %d, want 2", got)
	}
}

func TestSumEvenConcurrentEmpty(t *testing.T) {
	if got := SumEvenConcurrent([]int{}, 8); got != 0 {
		t.Errorf("got %d, want 0", got)
	}
}

func TestSumEvenConcurrentZeroWorkers(t *testing.T) {
	if got := SumEvenConcurrent([]int{2, 4}, 0); got != 6 {
		t.Errorf("got %d, want 6", got)
	}
}

func TestSumEvenConcurrentOddOnly(t *testing.T) {
	if got := SumEvenConcurrent([]int{1, 3, 5}, 2); got != 0 {
		t.Errorf("got %d, want 0", got)
	}
}

func TestSumEvenConcurrentFullSize(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping 10M-element test in -short mode")
	}
	const want int64 = 25_000_005_000_000
	if got := SumEvenConcurrent(generator.GenerateLargeSlice(10_000_000), 8); got != want {
		t.Errorf("got %d, want %d", got, want)
	}
}
