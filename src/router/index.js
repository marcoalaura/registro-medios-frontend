import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/components/registro/Dashboard';
import AppNotFound from '@/common/layout/pages/AppNotFound';
import AppForbidden from '@/common/layout/pages/AppForbidden';
import AppError from '@/common/layout/pages/AppError';

// System
import Login from '@/components/admin/auth/Login';
import LoginAdmin from '@/components/admin/auth/LoginAdmin';
import Olvido from '@/components/admin/auth/Olvido';
import Account from '@/components/admin/account/Account';
import Entidad from '@/components/admin/entidad/Entidad';
import Usuario from '@/components/admin/usuario/Usuario';
import Modulo from '@/components/admin/modulo/Modulo';
import Preferencias from '@/components/admin/preferencias/Preferencias';
import Log from '@/components/admin/Log';

// Medio
import Registro from '@/components/registro/medio/Registro';
import CreaTarifario from '@/components/registro/tarifario/Creacion';
import NoAdeudo from '@/components/registro/noAdeudo/NoAdeudo';
import Notificaciones from '@/components/registro/notificaciones/Notificaciones';
import Matricula from '@/components/registro/medio/SelectMatricula';

// Campañas
import Bandeja from '@/components/pauteo/campania/Bandeja';
import Campania from '@/components/pauteo/campania/Campania';
import VerCampania from '@/components/pauteo/campania/VerCampania';
import Orden from '@/components/pauteo/campania/Orden';
import Medios from '@/components/pauteo/medios/Medios';
import VerMedio from '@/components/pauteo/medios/VerMedio';
import VerCobertura from '@/components/pauteo/medios/VerCobertura';
import ViewTarifarioTvRadio from '@/components/pauteo/medios/ViewTarifarioTvRadio';
import Documentacion from '@/components/pauteo/documentacion/Documentacion';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/loginAdmin',
      name: 'LoginAdmin',
      component: LoginAdmin
    },
    {
      path: '/olvido',
      name: 'Olvido',
      component: Olvido
    },
    {
      path: '/usuarios',
      name: 'Usuario',
      component: Usuario
    },
    {
      path: '/account',
      name: 'Account',
      component: Account
    },
    {
      path: '/entidades',
      name: 'Entidad',
      component: Entidad
    },
    {
      path: '/registro',
      name: 'Registro',
      component: Registro
    },
    {
      path: '/no_adeudo',
      name: 'NoAdeudo',
      component: NoAdeudo
    },
    {
      path: '/notificaciones',
      name: 'Notificaicones',
      component: Notificaciones
    },
    {
      path: '/parametros',
      name: 'Preferencias',
      component: Preferencias
    },
    {
      path: '/modulos',
      name: 'Módulo',
      component: Modulo
    },
    {
      path: '/logs',
      name: 'Logs',
      component: Log
    },
    {
      path: '/seleccionarMatricula',
      name: 'SelectMatricula',
      component: Matricula
    },
    {
      path: '/404',
      component: AppNotFound
    },
    {
      path: '/403',
      component: AppForbidden
    },
    {
      path: '/500',
      component: AppError
    },
    {
      path: '*',
      component: AppNotFound
    },
    {
      path: '/tarifarios/:tipo',
      name: 'Crear Tarifario',
      component: CreaTarifario
    },
    {
      path: '/bandejaPauteo',
      name: 'Bandeja',
      component: Bandeja
    },
    {
      path: '/campana/:idCampana',
      name: 'Campaña',
      component: Campania
    },
    {
      path: '/vercampana/:idCampana',
      name: 'Ver Campaña',
      component: VerCampania
    },
    {
      path: '/documentacion',
      name: 'Documentacion',
      component: Documentacion
    },
    {
      path: '/medios',
      name: 'Medios',
      component: Medios
    },
    {
      path: '/vermedio/:idMedio',
      name: 'Ver Medio',
      component: VerMedio
    },
    {
      path: '/vercobertura',
      name: 'VerCobertura',
      component: VerCobertura
    },
    {
      path: '/viewtarifariotvradio/:idMedio',
      name: 'ViewTarifarioTvRadio',
      component: ViewTarifarioTvRadio
    },
    {
      path: '/ordenes/:idCampana/:idCampanaMedio',
      name: 'Órdenes de servicio',
      component: Orden
    }
  ]
});
