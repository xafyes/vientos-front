import {
  ArrowDown, ArrowLeft, ArrowRight, BedDouble, Calendar, Coffee, Droplet, Mail, MapPin, Phone, Plus,
  ShieldCheck, TriangleAlert, Users, X, type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'bed-double': BedDouble,
  calendar: Calendar,
  coffee: Coffee,
  droplet: Droplet,
  mail: Mail,
  'map-pin': MapPin,
  phone: Phone,
  plus: Plus,
  'shield-check': ShieldCheck,
  'alert-triangle': TriangleAlert,
  users: Users,
  x: X,
};

interface IconProps {
  name: keyof typeof ICONS;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 22, color = 'currentColor' }: IconProps) {
  const Svg = ICONS[name];
  return <Svg size={size} color={color} strokeWidth={1.5} style={{ display: 'block', flex: '0 0 auto' }} aria-hidden />;
}
