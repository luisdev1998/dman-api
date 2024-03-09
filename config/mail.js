import nodemailer from 'nodemailer'

const enviarEmail = async (data,proyecto,emailRemitente,claveRemitente,emailReceptor) => {
    const {email,telefono,nombre,apellido,dni} = data;
    const fechaActual = new Date();
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1;
    const día = fechaActual.getDate();
    // Obtener horas y minutos
    let horas = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();
    const ampm = horas >= 12 ? 'pm' : 'am';
    horas = horas % 12;
    horas = horas ? horas : 12; // la hora '0' debe ser '12'
    const minutosFormateados = minutos.toString().padStart(2, '0');
    const horaFormateada = `${horas}:${minutosFormateados} ${ampm}`;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailRemitente, // Tu correo de Gmail
          pass: claveRemitente, // Tu contraseña de Gmail o contraseña de aplicación
        },
      });

      // Configura los detalles del correo electrónico
      await transporter.sendMail({
        from: `"D'man Inmobiliaria & Constructora" <${emailRemitente}>`, // dirección del remitente
        to: emailReceptor, // lista de destinatarios
        subject: `CLIENTE - ${proyecto.titulo}`, // Línea de asunto
        html: `
        <div>El día de hoy ${año}/${mes}/${día} ${horaFormateada} el cliente con los siguientes datos:</div>
        <ul>
        <li>Nombres: ${nombre} ${apellido}</li>
        <li>DNI: ${dni}</li>
        <li>Celular: ${telefono}</li>
        <li>Correo: ${email}</li>
        </ul>
        <div>Ha enviado una solicitud porque está interesado en el proyecto <strong>${proyecto.titulo}</strong></div>`,
      });
}

export default enviarEmail;