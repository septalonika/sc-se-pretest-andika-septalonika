package generator

// GenerateLargeSlice returns a slice of length size holding 1, 2, ..., size.
// size must be >= 0.
func GenerateLargeSlice(size int) []int {
	data := make([]int, size)
	for i := range data {
		data[i] = i + 1
	}
	return data
}
