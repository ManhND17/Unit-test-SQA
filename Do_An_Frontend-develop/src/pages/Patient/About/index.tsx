import AppointmentBooking from '../components/AppointmentBooking';
import LocationMap from '../components/LocationMap';
import AboutIntro from './components/AboutIntro';
import FacilitiesShowcase from './components/FacilitiesShowcase';

export default function HospitalAbout() {
  return (
    <div className="px-8 py-6">
      <AboutIntro />
      <FacilitiesShowcase />
      <LocationMap />
      <AppointmentBooking />
    </div>
  );
}
