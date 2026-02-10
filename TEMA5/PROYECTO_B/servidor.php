<?php
// Archivo servidor: recibe peticiones AJAX y responde JSON
// --- MODO DEBUG: ACTIVAR PARA VER ERRORES ---
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Habilitar CORS y JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
// --- CHIVATO: Guardar lo que llega en un archivo de texto ---
$log = "Fecha: " . date("Y-m-d H:i:s") . "\n";
$log .= "Método: " . $_SERVER['REQUEST_METHOD'] . "\n";
$log .= "Datos recibidos: " . print_r($_POST, true) . "\n";
$log .= "-----------------------------------\n";
file_put_contents("debug_log.txt", $log, FILE_APPEND);
// -----------------------------------------------------------
// Configuracion BD y DSN
$host = 'localhost';
$db = 'curso_ajax';
$user = 'root';
$pass = 'toor'; // IMPORTANTE: En XAMPP suele ser vacío (''), no 'toor'
$charset = 'utf8mb4';
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

// VALIDAR METODO HTTP
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recoger TODOS los datos que llegan
    $nombre = $_POST['nombre'] ?? '';
    $correo = $_POST['correo'] ?? '';
    $movil  = $_POST['movil'] ?? '';
    $edad   = $_POST['edad'] ?? '';
    $idioma = $_POST['idioma'] ?? '';

    // Validación básica
    if (empty($nombre) || empty($correo) || empty($movil)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "error" => "Faltan campos obligatorios"]);
        exit;
    }

    try {
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);

        // Incluir todos los campos en el INSERT
        $sql = "INSERT INTO usuarios (nombre, correo, movil, edad, idioma) 
                VALUES (:nombre, :correo, :movil, :edad, :idioma)";

        // con esto preparamos la consulta para luego ejecutar con los valores reales, evitando inyecciones SQL
        $stmt = $pdo->prepare($sql);

        // Ejecutar con todos los valores
        $stmt->execute([
            'nombre' => $nombre,
            'correo' => $correo,
            'movil'  => $movil,
            'edad'   => $edad,
            'idioma' => $idioma
        ]);

        echo json_encode([
            "status" => "ok",
            "mensaje" => "Usuario $nombre registrado correctamente"
        ]);
    } catch (\PDOException $e) {
        // Manejo de errores de BDD (Ej: Correo duplicado código 23000) 
        if ($e->getCode() == 23000) {
            http_response_code(409); // Conflict 
            echo json_encode(["status" => "error", "error" => "El correo ya está registrado"]);
        } else {
            http_response_code(500); // Error interno 
            echo json_encode(["status" => "error", "error" => "Error en BDD: " . $e->getMessage()]);
        }
    }
// si la peticion es GET, devolvemos la lista de usuarios en JSON
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Manejar GET: devolver lista de usuarios en JSON

    try {
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);

        // sacamos todos los usuarios de la tabla para devolverlos al cliente
        $sql = "SELECT * FROM usuarios";

        // a diferencia del prepared, el query no lleva parametros, asi que lo ejecutamos directamente
        $stmt = $pdo->query($sql);

        // y con esto los obtenemos en un array asociativo para luego convertirlo a JSON
        $usuarios = $stmt->fetchAll();

        echo json_encode($usuarios);
    } catch (\PDOException $e) {
        if (http_response_code(500)) {
            echo json_encode(["status" => "error", "error" => "Error en BDD: " . $e->getMessage()]);
        }
    }
// si la peticion es DELETE, borramos el usuario con el id indicado en la query string (ej: servidor.php?id=3)
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    // cojemos el id del usuario a borrar de la query string
    $id = $_GET['id'];

    try {
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);

        $sql = "DELETE FROM usuarios WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $id]);

        // hacemos un chequeo para ver si se ha borrado realmente algo (si el id no existe, rowCount() será 0)
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                "status" => "ok", 
                "mensaje" => "Usuario con ID $id eliminado correctamente"
            ]);
        } else {
            echo json_encode([
                "status" => "error", 
                "error" => "No se encontró ningún usuario con ese ID"
            ]);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "error" => "Error BDD: " . $e->getMessage()]);
    }
// si la peticion es PUT, actualizamos el usuario con el id indicado en la query string (ej: servidor.php?id=3) y los datos que llegan en el cuerpo de la peticion (php://input)
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    // cojemos el id del usuario a modificar de la query string
    $id = $_GET['id'];

    // como php no tiene put, tenemos que leer el flujo de nntrada manualmente
    parse_str(file_get_contents("php://input"), $datosPUT);

    // y luego recoger los datos que llegan en el cuerpo de la peticion
    $nombre = $datosPUT['nombre'] ?? '';
    $correo = $datosPUT['correo'] ?? '';
    $movil  = $datosPUT['movil'] ?? '';
    $edad   = $datosPUT['edad'] ?? '';
    $idioma = $datosPUT['idioma'] ?? '';

    try {
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);

        // Incluir todos los campos en el UPDATE
        $sql = "UPDATE usuarios SET nombre = :nombre, correo = :correo, movil = :movil, edad = :edad, idioma = :idioma WHERE id = :id";        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id' => $id,
            'nombre' => $nombre,
            'correo' => $correo,
            'movil' => $movil,
            'edad' => $edad,
            'idioma' => $idioma
        ]);

        echo json_encode([
            "status" => "ok",
            "mensaje" => "Usuario $nombre modificado correctamente"
        ]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "error" => "Error BDD: " . $e->getMessage()]);
    }
} 

else {
    // Metodo no permitido: responder con 405
    http_response_code(405);
    echo json_encode(["status" => "error", "error" => "Metodo no permitido"]);
}
