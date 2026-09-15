package generator

import "testing"

func TestGenerateLargeSlice(t *testing.T) {
	const size = 1000
	data := GenerateLargeSlice(size)

	if len(data) != size {
		t.Fatalf("len = %d, want %d", len(data), size)
	}
	if data[0] != 1 {
		t.Errorf("data[0] = %d, want 1", data[0])
	}
	if data[size-1] != size {
		t.Errorf("data[%d] = %d, want %d", size-1, data[size-1], size)
	}
}

func TestGenerateLargeSliceEmpty(t *testing.T) {
	data := GenerateLargeSlice(0)
	if data == nil {
		t.Fatal("got nil slice, want empty non-nil slice")
	}
	if len(data) != 0 {
		t.Fatalf("len = %d, want 0", len(data))
	}
}
