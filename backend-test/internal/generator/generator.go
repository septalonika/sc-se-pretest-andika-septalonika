package generator

// GenerateLargeSlice returns a slice of length size holding 1, 2, ..., size.
//
// The slice is allocated once at its final length, so filling it never
// triggers a re-allocation or copy. size must be >= 0 (make panics otherwise).
func GenerateLargeSlice(size int) []int {
	data := make([]int, size)
	for i := range data {
		data[i] = i + 1
	}
	return data
}
