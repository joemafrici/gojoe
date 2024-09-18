package main

import (
	"github.com/shirou/gopsutil/v4/mem"
	"time"
)

func bytesToGB(bytes uint64) float64 {
	return float64(bytes) / (1024 * 1024 * 1024)
}

type Stat struct {
	Val  float64
	Desc string
}
type SysInfo struct {
	CurrentTime    time.Time
	MemTotal       Stat
	MemAvailable   Stat
	MemUsedPercent Stat
	// Linux specific
	MemPageTables Stat
	MemSwapCached Stat
	MemHighTotal  Stat
	MemHighFree   Stat
	MemLowTotal   Stat
	MemLowFree    Stat
	MemSwapTotal  Stat
	MemSwapFree   Stat
	MemCached     Stat
	Dirty         Stat
	Slab          Stat
}

func GetSysInfo() (SysInfo, error) {
	v, err := mem.VirtualMemory()
	if err != nil {
		return SysInfo{}, err
	}
	return SysInfo{
		CurrentTime:    time.Now(),
		MemTotal:       Stat{Val: bytesToGB(v.Total), Desc: "Total usable ram (i.e. physical ram minus a few reserved bits and the kernel binary code)"},
		MemAvailable:   Stat{Val: bytesToGB(v.Available), Desc: "An estimate of how much memory is available for starting new applications, without swapping. Calculated from MemFree, SReclaimable, the size of the file LRU lists, and the low watermarks in each zone. The estimate takes into account that the system needs some page cache to function well, and that not all reclaimable slab will be reclaimable, due to items being in use. The impact of those factors will vary from system to system."},
		MemUsedPercent: Stat{Val: v.UsedPercent, Desc: "Percentage of RAM used by programs This value is computed from the kernel specific values."},
		MemPageTables:  Stat{Val: bytesToGB(v.PageTables), Desc: "amount of memory dedicated to the lowest level of page tables"},
		MemCached:      Stat{Val: bytesToGB(v.Cached), Desc: "in-memory cache for files read from the disk (the pagecache).  Doesn't include SwapCached"},
		MemHighTotal:   Stat{Val: bytesToGB(v.HighTotal), Desc: "Total high memory"},
		MemHighFree:    Stat{Val: bytesToGB(v.HighFree), Desc: "Highmem is all memory above ~860MB of physical memory Highmem areas are for use by userspace programs, or for the pagecache.  The kernel must use tricks to access this memory, making it slower to access than lowmem."},
		MemLowTotal:    Stat{Val: bytesToGB(v.LowTotal), Desc: "Total low memory"},
		MemLowFree:     Stat{Val: bytesToGB(v.LowFree), Desc: "Lowmem is memory which can be used for everything that highmem can be used for, but it is also available for the kernel's use for its own data structures.  Among many other things, it is where everything from the Slab is allocated.  Bad things happen when you're out of lowmem."},
		MemSwapTotal:   Stat{Val: bytesToGB(v.SwapTotal), Desc: "total amount of swap space available"},
		MemSwapFree:    Stat{Val: bytesToGB(v.SwapFree), Desc: "Memory which has been evicted from RAM, and is temporarily on the disk"},
		MemSwapCached:  Stat{Val: bytesToGB(v.SwapCached), Desc: "Memory that once was swapped out, is swapped back in but still also is in the swapfile (if memory is needed it doesn't need to be swapped out AGAIN because it is already in the swapfile. This saves I/O)"},
		Dirty:          Stat{Val: bytesToGB(v.Dirty), Desc: "Memory which is waiting to get written back to the disk"},
		Slab:           Stat{Val: bytesToGB(v.Slab), Desc: "in-kernel data structures cache"},
	}, nil
}
