import { useLocalStorage } from './useLocalStorage';

// Tipos para os dados do salão
export interface Barber {
  id: string;
  nome: string;
  especialidade: string;
  telefone: string;
  email: string;
  foto: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export interface TimeSlot {
  id: string;
  hora: string;
  disponivel: boolean;
}

export interface DayConfig {
  id: string;
  nome: string;
  aberto: boolean;
  horarioInicio: string;
  horarioFim: string;
  slots: TimeSlot[];
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  barberId?: string;
  date: Date;
  time: string;
  status: string;
  notes?: string;
}

// Dados padrão
const DEFAULT_BARBERS: Barber[] = [
  {
    id: "1",
    nome: "Carlos Silva",
    especialidade: "Corte Clássico, Barba",
    telefone: "(11) 98765-4321",
    email: "carlos@barberstyle.com",
    foto: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    nome: "Rafael Oliveira",
    especialidade: "Corte Moderno, Coloração",
    telefone: "(11) 91234-5678",
    email: "rafael@barberstyle.com",
    foto: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    nome: "André Santos",
    especialidade: "Barba, Tratamentos",
    telefone: "(11) 99876-5432",
    email: "andre@barberstyle.com",
    foto: "/placeholder.svg?height=100&width=100",
  },
];

const DEFAULT_SERVICES: Service[] = [
  {
    id: "1",
    name: "Corte de Cabelo",
    description: "Cortes modernos e clássicos para todos os estilos.",
    price: 45.0,
    duration: 30,
  },
  {
    id: "2",
    name: "Barba",
    description: "Modelagem e aparagem de barba com toalha quente.",
    price: 35.0,
    duration: 20,
  },
  {
    id: "3",
    name: "Combo (Cabelo + Barba)",
    description: "Corte de cabelo e barba em um único serviço com desconto.",
    price: 70.0,
    duration: 50,
  },
  {
    id: "4",
    name: "Corte Infantil",
    description: "Corte especial para crianças até 12 anos.",
    price: 35.0,
    duration: 20,
  },
  {
    id: "5",
    name: "Coloração",
    description: "Mudança ou retoque de cor para os cabelos.",
    price: 80.0,
    duration: 60,
  },
  {
    id: "6",
    name: "Hidratação",
    description: "Tratamento profundo para todos os tipos de cabelo.",
    price: 50.0,
    duration: 40,
  },
];

const DIAS_SEMANA = [
  { id: "1", nome: "Segunda-feira" },
  { id: "2", nome: "Terça-feira" },
  { id: "3", nome: "Quarta-feira" },
  { id: "4", nome: "Quinta-feira" },
  { id: "5", nome: "Sexta-feira" },
  { id: "6", nome: "Sábado" },
  { id: "0", nome: "Domingo" },
];

const HORARIOS_PADRAO = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

const DEFAULT_TIME_SLOTS: DayConfig[] = DIAS_SEMANA.map((dia) => ({
  id: dia.id,
  nome: dia.nome,
  aberto: dia.id !== "0", // Fechado aos domingos por padrão
  horarioInicio: "09:00",
  horarioFim: "18:00",
  slots: HORARIOS_PADRAO.map((hora, index) => ({
    id: `${dia.id}-${index}`,
    hora,
    disponivel: true,
  })),
}));

// Hook que centraliza todas as operações de dados do salão
export function useBarberData() {
  // Hooks para cada tipo de dado
  const [barbers, setBarbers] = useLocalStorage<Barber[]>("barberBarbers", DEFAULT_BARBERS);
  const [services, setServices] = useLocalStorage<Service[]>("barberServices", DEFAULT_SERVICES);
  const [timeSlots, setTimeSlots] = useLocalStorage<DayConfig[]>("barberTimeSlots", DEFAULT_TIME_SLOTS);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>("barberAppointments", []);
  const [isAdmin, setIsAdmin] = useLocalStorage<boolean>("barberAdmin", false);

  // Funções para manipular barbeiros
  const addBarber = (barber: Omit<Barber, 'id'>) => {
    const newBarber = {
      ...barber,
      id: (barbers.length + 1).toString(),
    };
    setBarbers([...barbers, newBarber]);
    return newBarber;
  };

  const updateBarber = (id: string, barber: Partial<Barber>) => {
    const updatedBarbers = barbers.map((b) => (b.id === id ? { ...b, ...barber } : b));
    setBarbers(updatedBarbers);
  };

  const deleteBarber = (id: string) => {
    setBarbers(barbers.filter((b) => b.id !== id));
  };

  // Funções para manipular serviços
  const addService = (service: Omit<Service, 'id'>) => {
    const newService = {
      ...service,
      id: (services.length + 1).toString(),
    };
    setServices([...services, newService]);
    return newService;
  };

  const updateService = (id: string, service: Partial<Service>) => {
    const updatedServices = services.map((s) => (s.id === id ? { ...s, ...service } : s));
    setServices(updatedServices);
  };

  const deleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  // Funções para manipular horários
  const updateTimeSlot = (dayId: string, slotId: string, available: boolean) => {
    const updatedTimeSlots = timeSlots.map((day) => {
      if (day.id === dayId) {
        return {
          ...day,
          slots: day.slots.map((slot) => 
            slot.id === slotId ? { ...slot, disponivel: available } : slot
          ),
        };
      }
      return day;
    });
    setTimeSlots(updatedTimeSlots);
  };

  const updateDayConfig = (dayId: string, config: Partial<DayConfig>) => {
    const updatedTimeSlots = timeSlots.map((day) => 
      day.id === dayId ? { ...day, ...config } : day
    );
    setTimeSlots(updatedTimeSlots);
  };

  // Funções para manipular agendamentos
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    setAppointments([...appointments, newAppointment]);
    return newAppointment;
  };

  const updateAppointment = (id: string, appointment: Partial<Appointment>) => {
    const updatedAppointments = appointments.map((a) => 
      a.id === id ? { ...a, ...appointment } : a
    );
    setAppointments(updatedAppointments);
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter((a) => a.id !== id));
  };

  // Login/Logout
  const login = () => setIsAdmin(true);
  const logout = () => setIsAdmin(false);

  return {
    // Dados
    barbers,
    services,
    timeSlots,
    appointments,
    isAdmin,
    
    // Funções para barbeiros
    addBarber,
    updateBarber,
    deleteBarber,
    
    // Funções para serviços
    addService,
    updateService,
    deleteService,
    
    // Funções para horários
    updateTimeSlot,
    updateDayConfig,
    
    // Funções para agendamentos
    addAppointment,
    updateAppointment,
    deleteAppointment,
    
    // Autenticação
    login,
    logout,
  };
} 