# 🚗 Telegram Car Auction Bot

Una aplicación web para Telegram que permite a los usuarios participar en subastas de carros, gestionar su perfil y guardar carros favoritos.

## 🚀 Características

- **🔍 Explorar Subastas**: Navega por carros disponibles en subasta
- **💰 Sistema de Pujas**: Realiza pujas en tiempo real
- **❤️ Favoritos**: Guarda tus carros favoritos
- **👤 Gestión de Perfil**: Administra tu información personal
- **📱 Compatible con Telegram**: Integración completa con Telegram Web Apps
- **🎨 Diseño Responsivo**: Optimizado para dispositivos móviles
- **🔐 Sistema de Aprobación**: Control de acceso por estados de usuario
- **⏳ Estados de Usuario**: Pending, Approved, Rejected, Suspended

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Integración**: Telegram Web Apps API
- **Storage**: LocalStorage para datos del usuario
- **Styling**: CSS Variables para temas de Telegram

## 🔧 Instalación y Uso

### Para Desarrolladores

1. Clona el repositorio:
```bash
git clone https://github.com/luiso2/telegram-bid-bot.git
cd telegram-bid-bot
```

2. Abre `index.html` en tu navegador para desarrollo local

3. Para probar en Telegram:
   - Despliega en GitHub Pages
   - Configura tu bot de Telegram
   - Añade la URL como Web App

### Para Usuarios

1. Busca el bot en Telegram
2. Inicia una conversación
3. Presiona el botón "Abrir App" para acceder a la aplicación web

## 🎯 Funcionalidades Principales

### 🏷️ Subastas de Carros
- Visualización de carros disponibles
- Filtros por marca y precio
- Búsqueda por nombre
- Información detallada de cada vehículo
- Tiempo restante de subasta

### 💸 Sistema de Pujas
- Pujas en tiempo real
- Validación de puja mínima
- Historial de pujas del usuario
- Notificaciones de éxito

### 💖 Gestión de Favoritos
- Añadir/quitar carros de favoritos
- Vista dedicada de favoritos
- Persistencia de datos local

### 👤 Perfil de Usuario
- Información personal editable
- Historial de pujas
- Configuración de preferencias

## 🔐 Seguridad y Privacidad

- Los datos se almacenan localmente en el dispositivo
- Integración segura con Telegram Web Apps
- Validación de entrada de datos
- No se requiere registro adicional

## 🌐 Despliegue en GitHub Pages

El proyecto está configurado para desplegarse automáticamente en GitHub Pages:

1. Push a la rama `main`
2. La aplicación estará disponible en: `https://luiso2.github.io/telegram-bid-bot/`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Estructura del Proyecto

```
telegram-bid-bot/
├── index.html          # Página principal
├── style.css           # Estilos de la aplicación
├── script.js           # Lógica de la aplicación
└── README.md           # Documentación
```

## 🔐 Sistema de Estados de Usuario

La aplicación implementa un sistema de aprobación con los siguientes estados:

### Estados Disponibles:
- **⏳ Pending**: Usuario nuevo esperando aprobación del administrador
- **✅ Approved**: Usuario aprobado con acceso completo a todas las funciones
- **❌ Rejected**: Usuario rechazado, puede solicitar una nueva revisión
- **🚫 Suspended**: Usuario suspendido temporalmente con acceso limitado

### Funcionalidades por Estado:

| Función | Pending | Approved | Rejected | Suspended |
|---------|---------|----------|----------|-----------|
| Ver subastas | ❌ | ✅ | ❌ | ✅ |
| Hacer pujas | ❌ | ✅ | ❌ | ❌ |
| Agregar favoritos | ❌ | ✅ | ❌ | ❌ |
| Editar perfil | ✅ | ✅ | ✅ | ✅ |
| Contactar soporte | ✅ | ✅ | ✅ | ✅ |

### Pantallas de Estado:
Cada estado muestra una pantalla específica con:
- Mensaje explicativo del estado actual
- Acciones disponibles (verificar estado, contactar soporte, etc.)
- Información sobre próximos pasos
- Diseño visual distintivo por estado

## 🔄 Próximas Funcionalidades

- [ ] Panel de administración para gestión de usuarios
- [ ] Integración con API de subastas reales
- [ ] Notificaciones push para cambios de estado
- [ ] Chat en tiempo real
- [ ] Sistema de pagos
- [ ] Historial de transacciones
- [ ] Ratings y reviews
- [ ] Sistema de documentación para verificación

## 📱 Compatibilidad

- ✅ Telegram Web Apps
- ✅ Dispositivos móviles
- ✅ Navegadores modernos
- ✅ Temas de Telegram (claro/oscuro)

## 📞 Soporte

Para reportar bugs o solicitar nuevas características, abre un issue en este repositorio.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

Desarrollado con ❤️ para la comunidad de Telegram 