package main

import (
	"fmt"
	"runtime"
	"time"
)

const totalData = 10_000_000

func main() {
	// One worker per logical CPU: full use of the hardware, no over-threading.
	numWorkers := runtime.NumCPU()

	fmt.Printf("[*] System check: using %d workers (runtime.NumCPU)\n", numWorkers)
	fmt.Printf("[*] Generating slice with %d elements...\n", totalData)

	genStart := time.Now()
	// TODO(Step 2): data := GenerateLargeSlice(totalData)  -- see generator.go
	_ = genStart

	// TODO(Step 3-5): call SumEvenConcurrent(data, numWorkers) -- see worker.go
	fmt.Println("[*] Not implemented yet. See PLAN-test-go.MD §6 for the next steps.")
}
