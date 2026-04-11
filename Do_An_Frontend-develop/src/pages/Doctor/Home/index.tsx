import StatsGrid from './components/StatsGrid';
import DoctorCharts from './components/DoctorCharts';

export default function DoctorHome() {
  return (
    <main className="p-6">
      <StatsGrid />
      <DoctorCharts />
    </main>
  );
}
