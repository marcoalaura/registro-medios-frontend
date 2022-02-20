import error from './errors';
import validate from './validates';
import menu from './menu';

export default {
  error,
  validate,
  menu,
  app: {
    title: 'Sistema de registro de medios de comunicación y campañas publicitarias',
    account: 'Mi cuenta',
    settings: 'Configuración',
    logOut: 'Cerrar sesión',
    welcome: 'Bienvenido al',
    indicacion1: 'Por medio de la presenta plataforma, usted podrá registrar su información para ser considerado un proveedor de los servicios de Contratación del Ministerio de Comunicación del Estado.',
    indicacion2: 'Para ser parte de las contrataciones de publicidad, debe realizar su Registro y mantener actualizado el registro de No Adeudo de las AFPs. Con lo que se le notificará de las campañas que se realicen según el Tarifario que ha declarado.',
    indicacion3: 'Siga y complete siguientes pasos:',
    paso1: 'Debe mantener su registro actualizado, para poder participar de las diferentes contrataciones que realiza el Ministerio de Comunicación.',
    paso2: 'Debe registrar mensualmente su informe de No Adeudo de AFPs para ser considerado en las campañas publicitarias.',
    paso3: 'En recomienda revisar el manual de usuario, para comprender mejor el registro y funcionalidades que puede realizar en el sistema.',
    // paso3: 'En este espacio será notificado de las nuevas campañas y asuntos administrativos, como solicitudes de documentación correspondiente.',
    bpaso1: 'Registro y actualización del Medio',
    bpaso2: 'Reporte de no adeudo AFP\'s',
    bpaso3: 'Manual de usuario'
    // bpaso3: 'Notificaciones'
  },
  login: {
    system: 'Medios de comunicación',
    title: 'Inicia tu sesión',
    nit: 'NIT',
    user: 'Nombre de usuario',
    password: 'Contraseña',
    rememberMe: 'Recuérdame',
    forgotPass: '¿Se te olvidó la contraseña?',
    login: 'Ingresar',
    noAccount: '¿No tienes una cuenta?',
    signUp: 'Regístrate aquí',
    detail: 'Para ingresar al Sistema, usted debe emplear los datos del NIT, usuario y contraseña con los que accede a la Oficina Virtual del Servicio de Impuestos Nacionales.'
  },
  loginAdmin: {
    title: 'Administración del Sistema',
    user: 'Nombre de usuario',
    password: 'Contraseña',
    rememberMe: 'Recuérdame',
    forgotPass: '¿Se te olvidó la contraseña?',
    login: 'Ingresar',
    noAccount: '¿No tienes una cuenta?',
    signUp: 'Regístrate aquí'
  },
  olvido: {
    title: 'Recuperar mi cuenta',
    mail: 'Correo electrónico',
    info: 'Ingrese su correo electrónico para proseguir con la recuperación de su cuenta.',
    send: 'Enviar',
    inicio: 'página inicial'
  },
  common: {
    add: 'Agregar',
    required: 'Campo obligatorio',
    cancel: 'Cancelar',
    save: 'Guardar',
    rowsPage: 'Filas por página',
    updateList: 'Actualizar esta lista',
    filters: 'Filtros/búsqueda',
    of: 'de',
    active: 'Activo',
    observation: 'Observar',
    firm: 'Firmar',
    approve: 'Aprobar y Firmar',
    edit: 'Editar',
    status: 'Estado',
    actions: 'Acciones',
    close: 'Cerrar'
  },
  entity: {
    title: 'Entidades',
    add: 'Agregar nueva entidad',
    crud: {
      edit: 'Editar',
      code: 'Código',
      name: 'Nombre',
      acronym: 'Sigla',
      description: 'Descripción',
      status: 'Estado',
      addEnt: 'Agregar entidad',
      editEnt: 'Editar entidad',
      address: 'Dirección',
      email: 'Correo electrónico de atención al cliente',
      phones: 'Teléfono(s)',
      web: 'Página web de la entidad',
      user_ppte: 'Usuario en el sistema PPTE',
      pass_ppte: 'Contraseña en el sistema PPTE'
    }
  },
  medio: {
    title: 'Medio de Comunicación',
    crud: {
      edit: 'Editar',
      code: 'Código',
      name: 'Nombre',
      acronym: 'Sigla',
      nit: 'Número de Identificación Tributaria',
      matricula: 'Matrícula',
      email: 'Correo electrónico',
      tipomedio: 'Tipo de medio',
      tipoproductor: 'Tipo productor',
      telefono: 'Teléfono',
      telefonos: 'Teléfonos',
      razonsocial: 'Razón social',
      tiposocietario: 'Tipo societario',
      direccion: 'Dirección del medio de comunicación',
      web: 'Página web de la entidad',
      poder: 'Poder del representante legal',
      att: 'Permiso otorgado por la ATT',
      rupe: 'Certificado del RUPE',
      contrato: 'Contrato realizado con el/los medio(s) de comunicación',
      representante: {
        tipo_documento: 'Tipo de documento',
        ci: 'Número de documento',
        propietario: 'Propietario',
        representante: 'Representante legal',
        nombre_completo: 'Nombre completo',
        nombres: 'Nombres',
        primer_apellido: 'Primer Apellido',
        segundo_apellido: 'Segundo Apellido',
        fecha_nacimiento: 'Fecha de nacimiento',
        celular: 'Celular del representante',
        telefonos: 'Teléfono(s) o celular(es) del representante',
        email: 'Correo del representante',
        direccion: 'Dirección del representante'
      },
      referencia: {
        tipo_documento: 'Tipo de documento',
        ci: 'Número de documento',
        fecha_nacimiento: 'Fecha de nacimiento',
        nombre_completo: 'Nombre completo',
        nombres: 'Nombres',
        primer_apellido: 'Primer Apellido',
        segundo_apellido: 'Segundo Apellido',
        celular: 'Celular de la persona de referencia',
        telefonos: 'Teléfono(s) o celular(es) de la persona de referencia',
        email: 'Correo de la persona de referencia',
        direccion: 'Dirección de la persona de referencia'
      },
      cobertura: 'Cobertura del medio de comunicación',
      seleccione_cobertura: 'Seleccione la cobertura de los medios de comunicación',
      seccion_general: 'Información general del medio de comunicación',
      seccion_representante: 'Representante legal del medio de comunicación',
      seccion_referencia: 'Persona de referencia del medio de comunicación',
      addEnt: 'Agregar entidad',
      editEnt: 'Editar entidad',
      medioComunicacion: 'Medio de comunicación',
      red: 'Red de medios de comunicación',
      productor: 'Productor independiente',
      medios: 'Medios de comunicación relacionadas a la red'
    },
    tarifario: {
      title: 'Tarifario'
    },
    noadeudo: {
      title: 'Certificado de no adeudo a las AFP\'s',
      registro_afp: 'Certificado de no adeudo a las AFP\'s',
      anio: 'Año del registro',
      mes: 'Mes de registro',
      registros_afps: 'Registros AFP\'s realizados',
      seleccione: 'Seleccione la gestión que quiere registrar:'
    },
    msgNoMatriculas: 'No se ha podido verificar la existencia de una matrícula de comercio vigente, por favor intente nuevamente una vez solucionado el inconveniente en Fundempresa',
    volverAtras: 'Para volver atrás, haga click: ',
    msgElegirMatricula: 'Seleccione la matrícula de comercio a la cual desea asociar esta cuenta. Recuerde que esta matrícula debe corresponder al rubro.'
  },
  referencia: {
    crud: {
      nombre: 'Nombre de la persona de referencia',
      apellidoPaterno: 'Apellido Paterno',
      apellidoMaterno: 'Apellido Materno',
      tipoDocumento: 'Tipo Doc.',
      cedulaIdentidad: 'Nro. documento',
      fechaNacimiento: 'Fecha de Nacimiento',
      celular: 'Celular',
      telefonos: 'Teléfono(s)/Celular(es)',
      email: 'Correo electrónico'
    }
  },
  account: {
    title: 'Cuentas',
    add: 'Agregar nueva cuenta',
    select: 'Seleccione una entidad para ver sus cuentas',
    crud: {
      edit: 'Editar',
      accountNumber: 'Nro. de cuenta',
      status: 'Estado',
      entity: 'Entidad',
      addAc: 'Agregar cuenta',
      editAc: 'Editar cuenta'
    }
  },
  user: {
    title: 'Usuarios',
    add: 'Agregar nuevo usuario',
    crud: {
      edit: 'Editar',
      user: 'Usuario',
      userData: 'Datos del usuario',
      entity: 'Entidad',
      role: 'Rol',
      status: 'Estado',
      addUser: 'Agregar usuario',
      editUser: 'Editar usuario',
      fullname: 'Nombre completo',
      email: 'Correo electrónico'
    }
  },
  rol: {
    title: 'Roles',
    add: 'Agregar nuevo rol',
    crud: {
      name: 'Nombre',
      description: 'Descripción',
      tipo: 'Tipo',
      editRol: 'Editar Rol',
      addRol: 'Agregar Rol'
    }
  },
  parametro: {
    title: 'Parámetros',
    add: 'Agregar nuevo parámetro',
    preferencias: 'Preferencias',
    crud: {
      name: 'Nombre',
      value: 'Valor',
      label: 'Label',
      description: 'Descripción',
      editParametro: 'Editar Parámetro',
      addParametro: 'Agregar Parámetro'
    }
  },
  module: {
    title: 'Módulos y permisos',
    add: 'Agregar nuevo módulo',
    crud: {
      edit: 'Editar',
      module: 'Módulo padre',
      label: 'Título',
      path: 'Path',
      icon: 'Ícono',
      order: 'Orden',
      status: 'Estado',
      visible: 'Visible',
      is_visible: 'Es visible',
      submodule: 'Sub módulo',
      section: 'Sección',
      addModule: 'Agregar módulo',
      editModule: 'Editar módulo',
      permissions: 'Permisos'
    }
  },
  log: {
    title: 'Logs del sistema',
    crud: {
      nivel: 'Nivel',
      tipo: 'Tipo',
      mensaje: 'Mensaje',
      referencia: 'Referencia',
      ip: 'IP',
      fecha: 'Fecha de creación',
      usuario: 'Usuario'
    }
  },
  servicioIop: {
    title: 'Interoperabilidad',
    add: 'Agregar nuevo servicio',
    crud: {
      codigo: 'Código',
      metodo: 'Método',
      descripcion: 'Descripción',
      entidad: 'Entidad',
      url: 'Url',
      token: 'Token',
      tipo: 'Tipo',
      estado: 'Estado',
      editServicio: 'Editar Servicio Iop',
      addServicio: 'Agregar Servicio Iop'
    }
  }
};
