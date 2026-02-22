<?php
// Archivo servidor: recibe peticiones AJAX y responde JSON con Medoo
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

require 'vendor/autoload.php';

use Medoo\Medoo;

// ============================================
// CONEXIÓN A BASE DE DATOS CON MEDOO
// ============================================
try {
    $database = new Medoo([
        'type' => 'mysql',
        'host' => 'localhost',
        'database' => 'tienda_ropa',
        'username' => 'root',
        'password' => 'toor', // En XAMPP suele ser vacío, no 'toor'
        'charset' => 'utf8mb4',
        // Activar modo de errores con excepciones
        'option' => [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "error" => "No se pudo conectar a la base de datos: " . $e->getMessage()
    ]);
    exit;
}

// ============================================
// MÉTODO POST: INSERTAR NUEVO PRODUCTO
// ============================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Recoger datos del formulario
    $codigo = $_POST['codigo'] ?? '';
    $nombre = $_POST['nombre'] ?? '';
    $talla  = $_POST['talla'] ?? '';
    $precio = $_POST['precio'] ?? '';
    $email_creador = $_POST['email_creador'] ?? '';

    // Validación básica: comprobar que no falten campos obligatorios
    if (empty($codigo) || empty($nombre) || empty($talla) || empty($precio) || empty($email_creador)) {
        http_response_code(400);
        echo json_encode([
            "status" => "error", 
            "error" => "Faltan campos obligatorios"
        ]);
        exit;
    }

    try {
        // Insertar con Medoo (mucho más simple que PDO puro)
        $database->insert('productos', [
            'codigo' => $codigo,
            'nombre' => $nombre,
            'talla'  => $talla,
            'precio' => $precio,
            'email_creador' => $email_creador
        ]);

        // Todo OK: producto insertado
        echo json_encode([
            "status" => "ok",
            "mensaje" => "Producto $nombre registrado correctamente",
            "id" => $database->id() // ID del último registro insertado
        ]);

    } catch (PDOException $e) {
        // Capturar error de código duplicado (código 23000)
        if ($e->getCode() == '23000') {
            http_response_code(409);
            echo json_encode([
                "status" => "error", 
                "error" => "El código ya está registrado"
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "status" => "error", 
                "error" => "Error en BDD: " . $e->getMessage()
            ]);
        }
    }
}

// ============================================
// MÉTODO GET: OBTENER LISTA DE PRODUCTOS
// ============================================
else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    try {
        $codigoBuscado = $_GET['codigo'] ?? null;
        // Obtener todos los productos con Medoo
        if ($codigoBuscado) {
            // Si hay código, filtramos con LIKE (busca coincidencias parciales)
            $productos = $database->select('productos', '*', [
                // [~] es el operador LIKE en Medoo para buscar coincidencias
                "codigo[~]" => $codigoBuscado
            ]);
        } else {
            // Si no hay código, traemos todos
            $productos = $database->select('productos', '*');
        }

        // Devolver los productos en formato JSON
        echo json_encode($productos);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error", 
            "error" => "Error en BDD: " . $e->getMessage()
        ]);
    }
}

// ============================================
// MÉTODO DELETE: ELIMINAR PRODUCTO POR ID
// ============================================
else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    
    // Obtener el ID desde la query string (ej: servidor.php?id=3)
    $id = $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode([
            "status" => "error", 
            "error" => "No se proporcionó ID"
        ]);
        exit;
    }

    try {
        // Eliminar con Medoo
        $resultado = $database->delete('productos', [
            'id' => $id
        ]);

        // $resultado contiene el PDOStatement, usamos rowCount()
        if ($resultado->rowCount() > 0) {
            echo json_encode([
                "status" => "ok", 
                "mensaje" => "Producto con ID $id eliminado correctamente"
            ]);
        } else {
            echo json_encode([
                "status" => "error", 
                "error" => "No se encontró ningún producto con ese ID"
            ]);
        }

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error", 
            "error" => "Error BDD: " . $e->getMessage()
        ]);
    }
}

// ============================================
// MÉTODO PUT: ACTUALIZAR PRODUCTO POR ID
// ============================================
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    
    // Obtener ID desde la query string
    $id = $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode([
            "status" => "error", 
            "error" => "No se proporcionó ID"
        ]);
        exit;
    }

    // Leer datos del cuerpo de la petición PUT
    parse_str(file_get_contents("php://input"), $datosPUT);

    $codigo = $datosPUT['codigo'] ?? '';
    $nombre = $datosPUT['nombre'] ?? '';
    $talla  = $datosPUT['talla'] ?? '';
    $precio = $datosPUT['precio'] ?? '';
    $email_creador = $datosPUT['email_creador'] ?? '';

    try {
        // Actualizar con Medoo
        $database->update('productos', 
            // Datos a actualizar
            [
                'codigo' => $codigo,
                'nombre' => $nombre,
                'talla'  => $talla,
                'precio' => $precio,
                'email_creador' => $email_creador
            ],
            // Condición WHERE
            [
                'id' => $id
            ]
        );

        echo json_encode([
            "status" => "ok",
            "mensaje" => "Producto $nombre modificado correctamente"
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error", 
            "error" => "Error BDD: " . $e->getMessage()
        ]);
    }
}

// ============================================
// MÉTODO NO PERMITIDO
// ============================================
else {
    http_response_code(405);
    echo json_encode([
        "status" => "error", 
        "error" => "Método no permitido"
    ]);
}