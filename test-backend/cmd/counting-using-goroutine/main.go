package main

import (
	"fmt"
	"runtime"
	"time"

	"backend-test/internal/generator"
	"backend-test/internal/worker"
)

const totalData = 10_000_000

func main() {
	// One worker per logical CPU: full use of the hardware, no over-threading.
	numWorkers := runtime.NumCPU()

	fmt.Printf("[*] System check: using %d workers (runtime.NumCPU)\n", numWorkers)
	fmt.Printf("[*] Generating slice with %d elements...\n", totalData)

	genStart := time.Now()
	data := generator.GenerateLargeSlice(totalData)
	fmt.Printf("[*] Data ready in %v\n\n", time.Since(genStart))

	// Timing starts AFTER generation, so it measures only the concurrent work.
	fmt.Println("[*] Starting concurrent processing...")
	procStart := time.Now()
	totalEvenSum := worker.SumEvenConcurrent(data, numWorkers)
	elapsed := time.Since(procStart)

	fmt.Println()
	fmt.Println("========================================")
	fmt.Printf(" Total sum of even numbers: %d\n", totalEvenSum)
	fmt.Printf(" Concurrent execution time: %v\n", elapsed)
	fmt.Println("========================================")
}
