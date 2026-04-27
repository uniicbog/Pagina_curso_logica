import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.jpeg';
import { getProgress } from '../modules/storage';
import {
  Home,
  Box,
  Split,
  Repeat,
  RotateCw,
  Layers,
  Grid,
  FunctionSquare,
  BookOpen,
  Network,
  Youtube,
  Briefcase
} from 'lucide-react';

const menuItems = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'variables', label: '1. Variables', icon: Box },
  { id: 'condicionales', label: '2. Condicionales', icon: Split },
  { id: 'for', label: '3. Ciclo For', icon: Repeat },
  { id: 'while', label: '4. Ciclo While', icon: RotateCw },
  { id: 'anidados', label: '5. Ciclos Anidados', icon: Layers },
  { id: 'estructuras', label: '6. Arrays', icon: Grid },
  { id: 'funciones', label: '7. Funciones', icon: FunctionSquare },
  { id: 'explicacion-diagramas', label: '8. Explicación Diagramas', icon: BookOpen },
  { id: 'diagrama', label: '9. Generar diagrama', icon: Network },
  { id: 'material', label: 'Material Didáctico', icon: Youtube },
  { id: 'proyectos', label: 'Proyectos Guiados', icon: Briefcase }
];

const curriculumOrder = [
  'variables',
  'condicionales',
  'for',
  'while',
  'anidados',
  'estructuras',
  'funciones'
];

const Sidebar = ({ activeSection, onNavigate, isOpen, onClose }) => {
  const [progressData, setProgressData] = useState({});

  useEffect(() => {
    const data = {};
    curriculumOrder.forEach((key) => {
      data[key] = getProgress(key);
    });
    setProgressData(data);
  }, [activeSection]);

  return (
    <aside
      className={`w-64 flex flex-col h-screen fixed left-0 top-0 z-30 transition-transform duration-300 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } bg-secondary border-r border-slate-800`}
    >
      <div className="h-24 flex items-center justify-center p-4 border-b border-slate-800 bg-black/20">
        <img
          src={logo}
          alt="Logo Institucional"
          className="h-full w-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300 rounded-lg"
        />
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const prog = progressData[item.id] || 0;
          const isCurriculumItem = curriculumOrder.includes(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.id);
                onClose?.();
              }}
              className={`w-full flex flex-col px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3 w-full">
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500'} />
                <span className="flex-1 text-left">{item.label}</span>
              </div>

              {isCurriculumItem ? (
                <div className="w-full mt-2 bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div
                    className={`h-1 rounded-full ${prog >= 100 ? 'bg-green-400' : 'bg-primary'}`}
                    style={{ width: `${prog}%` }}
                  />
                </div>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="rounded-lg p-3 bg-slate-800/50">
          <p className="text-xs text-center text-slate-500">
            © 2024 Unidad de Informática
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
