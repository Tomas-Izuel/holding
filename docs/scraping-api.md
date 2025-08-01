# API de Scraping

Esta API permite al microservicio de scraping obtener todos los grupos y holdings para realizar el scraping de precios.

## Endpoint

### GET /api/scraping/groups

Obtiene todos los grupos con sus holdings para el scraping.

#### Autenticación

La autenticación se realiza mediante API key en el header:

```
x-api-key: YOUR_API_KEY
```

#### Variables de Entorno

Asegúrate de configurar la siguiente variable de entorno en tu aplicación:

```env
SCRAPING_API_KEY=tu_api_key_secreta_aqui
```

#### Respuesta Exitosa

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-del-grupo",
      "name": "Nombre del Grupo",
      "userId": "uuid-del-usuario",
      "typeId": "uuid-del-tipo",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "type": {
        "id": "uuid-del-tipo",
        "name": "Cedears",
        "scrappingUrl": "https://api.example.com/cedears",
        "currency": "USD"
      },
      "holdings": [
        {
          "id": "uuid-del-holding",
          "name": "Apple",
          "code": "AAPL",
          "groupId": "uuid-del-grupo",
          "quantity": 10.5,
          "lastPrice": 150.25,
          "earnings": 25.5,
          "relativeEarnings": 0.2
        }
      ],
      "user": {
        "id": "uuid-del-usuario",
        "email": "usuario@ejemplo.com",
        "name": "Nombre del Usuario"
      }
    }
  ],
  "total": 1
}
```

#### Respuesta de Error

```json
{
  "error": "API key inválida o no proporcionada",
  "success": false
}
```

#### Códigos de Estado

- `200`: Éxito
- `401`: API key inválida o no proporcionada
- `500`: Error interno del servidor

## Uso en el Microservicio de Scraping

El microservicio de scraping en Go puede consumir esta API de la siguiente manera:

```go
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

type Group struct {
    ID        string `json:"id"`
    Name      string `json:"name"`
    Type      TypeInvestment `json:"type"`
    Holdings  []Holding `json:"holdings"`
    User      User `json:"user"`
}

type TypeInvestment struct {
    ID           string `json:"id"`
    Name         string `json:"name"`
    ScrappingUrl string `json:"scrappingUrl"`
    Currency     string `json:"currency"`
}

type Holding struct {
    ID               string  `json:"id"`
    Name             string  `json:"name"`
    Code             string  `json:"code"`
    Quantity         float64 `json:"quantity"`
    LastPrice        *float64 `json:"lastPrice"`
    Earnings         *float64 `json:"earnings"`
    RelativeEarnings *float64 `json:"relativeEarnings"`
}

type User struct {
    ID    string `json:"id"`
    Email string `json:"email"`
    Name  string `json:"name"`
}

type ApiResponse struct {
    Success bool     `json:"success"`
    Data    []Group `json:"data"`
    Total   int     `json:"total"`
}

func fetchGroups(apiKey string) (*ApiResponse, error) {
    req, err := http.NewRequest("GET", "http://tu-app.com/api/scraping/groups", nil)
    if err != nil {
        return nil, err
    }

    req.Header.Set("x-api-key", apiKey)
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    if resp.StatusCode != 200 {
        return nil, fmt.Errorf("error en la respuesta: %d", resp.StatusCode)
    }

    var apiResponse ApiResponse
    if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
        return nil, err
    }

    return &apiResponse, nil
}
```

## Seguridad

- La API key debe ser una cadena segura y única
- Se recomienda usar variables de entorno para almacenar la API key
- La API key debe ser compartida de forma segura entre los servicios
- Considera implementar rate limiting para prevenir abuso
