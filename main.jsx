
const { useState, useEffect } = React;

const API_CLAVE = "24aab2eb8aec803263f83e8daefaa6f4";

const AppClima = () => {
    const [clima, setClima] = useState(null);
    const [ciudadSeleccionada, setCiudadSeleccionada] = useState("Madrid");
    const [entradaBuscar, setEntradaBuscar] = useState("");
    const urlIcono = clima ? `./openweathermap/${clima.weather[0].icon}.svg` : "";

    const obtenerClima = async (ciudad) => {
        try {
            const respuesta = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_CLAVE}&units=metric`
            );
            const datos = await respuesta.json();
            setClima(datos);
            
            // Guarda la búsqueda en el servidor
            await fetch('http://localhost:3000/clima', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ciudad: datos.name,
                    clima: `Temperatura: ${datos.main.temp}C°, Mínima: ${datos.main.temp_min}C°, Máxima: ${datos.main.temp_max}C°, Humedad: ${datos.main.humidity}%`
                })
            });
        } catch (error) {
            console.error('Error al obtener el clima o guardar en el servidor', error);
        }
    };

    useEffect(() => {
        obtenerClima(ciudadSeleccionada);
    }, [ciudadSeleccionada]);

    const cambioEntradaBuscar = (evento) => {
        setEntradaBuscar(evento.target.value);
    };

    const manejarBuscar = () => {
        if (entradaBuscar.trim() !== "") {
            setCiudadSeleccionada(entradaBuscar);
            setEntradaBuscar("");
        }
    };

    const manejarTeclaPresionada = (evento) => {
        if (evento.key === "Enter") {
            manejarBuscar();
        }
    };

    return (
        <>
            <nav>
                <ul>
                    <li>
                        <h1 className="title">Weather App</h1>
                    </li>
                </ul>
            </nav>

            <div className="search-container">
                <input
                    className="search"
                    type="search"
                    name="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={entradaBuscar}
                    onChange={cambioEntradaBuscar}
                    onKeyDown={manejarTeclaPresionada}
                />
            </div>

            <div className="Ciudad_Clima">
                {ciudadSeleccionada && clima && (
                    <>
                        <article className="datos">
                            <header>
                                <h2>{ciudadSeleccionada}</h2>
                            </header>
                            <div className="iconos">
                                <img src={urlIcono} alt="Icono del Clima" />
                            </div>
                            <footer>
                                <h2>Temperatura: {clima.main.temp}C°</h2>
                                <p>
                                    Mínima: {clima.main.temp_min}C° / Máxima: {clima.main.temp_max}C°
                                </p>
                                <p>Humedad: {clima.main.humidity}%</p>
                            </footer>
                        </article>
                    </>
                )}
            </div>
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppClima />);
