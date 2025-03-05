import { execAsync, readFileAsync, Variable } from "astal";
import { Gtk } from "astal/gtk4";

// CPU Frequency
const getCpuFrequency: (cpu: number) => Promise<number | null> = async (
  cpu: number,
): Promise<number | null> => {
  // There are 8 logical cores, 4 physical cores in my laptop
  // so there are 8 files which have their own frequecy rating in KHz
  const path = `/sys/devices/system/cpu/cpu${cpu}/cpufreq/scaling_cur_freq`;
  try {
    // parseInt with base 10
    const freq: number = parseInt(
      await readFileAsync(path).then((data) => data.trim()),
      10,
    );
    return freq;
  } catch {
    return null;
  }
};

const getAverageCpuFrequency: () => Promise<string> =
  async (): Promise<string> => {
    // Create array as [0,1,2,3,4,5,6,7]
    const cpuIndices: number[] = Array.from({ length: 8 }, (_, i) => i);
    let totalFreq: number = 0;
    let coreCount: number = 0;

    for (const cpu of cpuIndices) {
      const freq: number | null = await getCpuFrequency(cpu);
      // Add up frequencies then later divide
      if (freq !== null) {
        totalFreq += freq;
        coreCount++;
      }
    }

    if (coreCount === 0) return "N/A";
    // Convert KHz to GHz
    return (totalFreq / coreCount / 1000000).toFixed(2) + "GHz";
  };

// CPU Usage
let prevCpuStat: { totalTime?: number; totalIdle?: number } = {};

const getCpuUsage: () => Promise<string> = async (): Promise<string> => {
  // /proc/stat reports usage over time, which will always increase, therefore
  // we need to compare results of two iterations to get the desired results
  // The cpu line has the following items
  //  - 1st column : user = normal processes executing in user mode
  //  - 2nd column : nice = niced processes executing in user mode
  //  - 3rd column : system = processes executing in kernel mode
  //  - 4th column : idle = twiddling thumbs
  //  - 5th column : iowait = waiting for I/O to complete
  //  - 6th column : irq = servicing interrupts
  //  - 7th column : softirq = servicing softirqs

  const statPath = "/proc/stat";

  try {
    const data: string = await readFileAsync(statPath);
    const lines: string[] = data.trim().split("\n");
    const cpuLine: number[] = lines[0].split(/\s+/).slice(1).map(Number);

    if (cpuLine.length < 4) return "N/A";

    const [user, nice, system, idle, iowait, irq, softirq, steal] = cpuLine;
    const totalIdle: number = idle + iowait;
    const totalUsage: number = user + nice + system + irq + softirq + steal;
    const totalTime: number = totalUsage + totalIdle;

    // Runs only for first time, sets prevCpuStat to be used in next iteration.
    if (!prevCpuStat.totalTime || !prevCpuStat.totalIdle) {
      prevCpuStat.totalTime = totalTime;
      prevCpuStat.totalIdle = totalIdle;
      return "0%";
    }

    const totalDiff: number = totalTime - prevCpuStat.totalTime;
    const idleDiff: number = totalIdle - prevCpuStat.totalIdle;

    prevCpuStat.totalTime = totalTime;
    prevCpuStat.totalIdle = totalIdle;

    const usage = ((totalDiff - idleDiff) / totalDiff) * 100;
    return usage.toFixed(1) + "%";
  } catch {
    return "N/A";
  }
};

// CPU Temperature
const getCpuTemperature: () => Promise<string> = async (): Promise<string> => {
  const thermalZone = 0;
  const path = `/sys/class/thermal/thermal_zone${thermalZone}/temp`;

  try {
    const temp = parseInt((await readFileAsync(path)).trim(), 10);
    return (temp / 1000).toFixed(0) + "°C";
  } catch {
    return "N/A";
  }
};

type CpuStat = {
  frequency: string;
  usage: string;
  temperature: string;
  power: string;
};

const cpuStatInit: CpuStat = {
  frequency: "N/A",
  usage: "N/A",
  temperature: "N/A",
  power: "N/A",
};

// Laptop power usage
const getEnergyRate: () => Promise<string> = async (): Promise<string> => {
  const path = "/sys/class/power_supply/BAT0/power_now";

  try {
    const power = parseInt((await readFileAsync(path)).trim(), 10);
    return (power / 1000000).toFixed(1) + "W";
  } catch {
    return "N/A";
  }
};

// Memory
// Memory usage
const getMemoryUsage: () => Promise<string> = async (): Promise<string> => {
  const meminfoPath = "/proc/meminfo";

  try {
    const data: string = await readFileAsync(meminfoPath);
    const lines: string[] = data.trim().split("\n");

    let memTotal: number = 0;
    let memAvailable: number = 0;

    for (const line of lines) {
      if (line.startsWith("MemTotal:"))
        memTotal = parseInt(line.split(/\s+/)[1], 10);
      else if (line.startsWith("MemAvailable:"))
        memAvailable = parseInt(line.split(/\s+/)[1], 10);
    }

    if (memTotal === 0) return "N/A";

    const memUsagePercent = ((memTotal - memAvailable) / memTotal) * 100;

    return memUsagePercent.toFixed(1) + "%";
  } catch {
    return "N/A";
  }
};

const memoryUsage: Variable<string> = Variable<string>("N/A").poll(
  2000,
  async () => await getMemoryUsage(),
);

const getCpuStats: () => Promise<CpuStat> = async (): Promise<CpuStat> => {
  try {
    const [frequency, usage, temperature, power] = await Promise.all([
      getAverageCpuFrequency(),
      getCpuUsage(),
      getCpuTemperature(),
      getEnergyRate(),
    ]);

    return {
      frequency,
      usage,
      temperature,
      power,
    };
  } catch {
    return cpuStatInit;
  }
};

const cpuStats: Variable<CpuStat> = Variable<CpuStat>(cpuStatInit);

cpuStats.poll(2000, async () => await getCpuStats());

const cpuStatsVisible: Variable<boolean> = Variable<boolean>(true);

const toggleCpuStats: () => void = (): void => {
  cpuStatsVisible.set(!cpuStatsVisible.get());
  if (cpuStatsVisible.get()) {
    cpuStats.startPoll();
    memoryUsage.startPoll();
  } else {
    cpuStats.stopPoll();
    memoryUsage.stopPoll();
  }
};

// ----------------------------------
// NVIDIA
// ----------------------------------

// Nvidia
const isNvidiaGpuPresent: () => Promise<boolean> =
  async (): Promise<boolean> => {
    // Directly using nvidia-smi to get status of GPU
    try {
      const output: string = await execAsync("nvidia-smi -L");
      return output.includes("GPU");
    } catch {
      return false;
    }
  };

type NvidiaStat = {
  gpuClock: string;
  memClock: string;
  memory: string;
  temp: string;
  powerDraw: string;
};

const nvidiaStatInit: NvidiaStat = {
  gpuClock: "N/A",
  memClock: "N/A",
  memory: "N/A",
  temp: "N/A",
  powerDraw: "N/A",
};

const getNvidiaStats: () => Promise<NvidiaStat> =
  async (): Promise<NvidiaStat> => {
    try {
      const query: string = [
        "temperature.gpu",
        "clocks.current.graphics",
        "clocks.current.memory",
        "memory.used",
        "memory.total",
        "power.draw",
      ].join(",");

      const output: string = await execAsync(
        `nvidia-smi --query-gpu=${query} --format=csv,noheader,nounits`,
      );

      const [temp, gpuClock, memClock, memUsed, memTotal, powerDraw] = output
        .trim()
        .split(", ");

      return {
        gpuClock: `${gpuClock}MHz`,
        memClock: `${memClock}MHz`,
        memory: `${((Number(memUsed) / Number(memTotal)) * 100).toFixed(1)}%`,
        temp: `${temp}°C`,
        powerDraw: `${powerDraw}W`,
      };
    } catch {
      return nvidiaStatInit;
    }
  };

export const nvidiaGpuPresent: boolean = await isNvidiaGpuPresent();

const nvidiaStats: Variable<NvidiaStat> = Variable<NvidiaStat>(nvidiaStatInit);

if (nvidiaGpuPresent) {
  nvidiaStats.poll(2000, async () => await getNvidiaStats());
}

const nvidiaStatsVisible: Variable<boolean> = Variable<boolean>(true);

const toggleNvidiaStats = () => {
  nvidiaStatsVisible.set(!nvidiaStatsVisible.get());
  if (nvidiaStatsVisible.get()) {
    nvidiaStats.startPoll();
  } else {
    nvidiaStats.stopPoll();
  }
};

export const StatsWidget: () => Gtk.Widget = () => (
  <>
    <button cssClasses={["button-widget"]} onButtonPressed={toggleCpuStats}>
      <box cssClasses={["stats-box"]} visible={cpuStatsVisible()}>
        <image file={"./icons/processor-symbolic.svg"} />
        <label>{cpuStats((stat) => stat.frequency)}</label>
        <label>{cpuStats((stat) => stat.usage)}</label>
        <label>{cpuStats((stat) => stat.temperature)}</label>
        <label>{cpuStats((stat) => stat.power)}</label>

        <image file={"./icons/memory-symbolic.svg"} />
        <label>{memoryUsage()}</label>
      </box>
    </button>
    <button
      cssClasses={["button-widget", "nvidia-stats"]}
      onButtonPressed={toggleNvidiaStats}
      visible={nvidiaGpuPresent}
    >
      <box cssClasses={["stats-box"]} visible={nvidiaStatsVisible()}>
        <image file={"./icons/pci-card-symbolic.svg"} />
        <label>{nvidiaStats((stat) => stat.gpuClock)}</label>
        <label>{nvidiaStats((stat) => stat.memClock)}</label>
        <label>{nvidiaStats((stat) => stat.memory)}</label>
        <label>{nvidiaStats((stat) => stat.temp)}</label>
        <label>{nvidiaStats((stat) => stat.powerDraw)}</label>
      </box>
    </button>
  </>
);
