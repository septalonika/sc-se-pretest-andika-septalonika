package worker

import "sync"

// SumEvenChunk sums the even numbers in data and sends the result on results.
func SumEvenChunk(data []int, results chan<- int64, wg *sync.WaitGroup) {
	defer wg.Done()

	var localSum int64
	for _, num := range data {
		if num%2 == 0 {
			localSum += int64(num)
		}
	}

	results <- localSum
}

// SumEvenSequential is the single-goroutine baseline.
func SumEvenSequential(data []int) int64 {
	var sum int64
	for _, num := range data {
		if num%2 == 0 {
			sum += int64(num)
		}
	}
	return sum
}

// SumEvenConcurrent splits data into numWorkers contiguous chunks, sums the
// even numbers of each chunk in its own goroutine, and returns the total.
func SumEvenConcurrent(data []int, numWorkers int) int64 {
	if len(data) == 0 {
		return 0
	}
	if numWorkers < 1 {
		numWorkers = 1
	}
	if numWorkers > len(data) {
		numWorkers = len(data)
	}

	var wg sync.WaitGroup
	results := make(chan int64, numWorkers)

	chunkSize := len(data) / numWorkers

	for i := 0; i < numWorkers; i++ {
		start := i * chunkSize
		end := start + chunkSize

		// The last worker also takes the remainder (len(data) % numWorkers).
		// Without this, those trailing elements are silently skipped.
		if i == numWorkers-1 {
			end = len(data)
		}

		wg.Add(1)
		go SumEvenChunk(data[start:end], results, &wg)
	}

	// Close results once every worker has finished, so the range loop
	// below knows when to stop.
	go func() {
		wg.Wait()
		close(results)
	}()

	var total int64
	for partialSum := range results {
		total += partialSum
	}
	return total
}
