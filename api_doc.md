# Dian Contacts

本模块的作用是提供Dian团队联系人管理页面的CRUD接口
**以下接口`Content Type`均为`application/json`**

## Add Contact

### HTTP Method

```
[POST]
```

### Path

```
/contacts
```

### Post Body参数

示例

```JSON
{
    "phone": "18827054816",
    "name": "郭宇",
    "email": "test@gmail.com"
}
```

字段说明
|字段|类型|说明|样例|是否必需|
|:---:|:---:|:---:|:---:|:---:|
|phone|string|中国大陆11位手机号|18827046729|是|
|name|string|人名，1-10个字符|abc|是|
|email|string|邮件地址|test@gmail.com|否|

### Response

样例
```JSON
{
  "result": {
    "phone": "18827054813",
    "name": "dian",
    "email": "email@email.com",
    "contact_id": "5a2fa038874a0e1afc9a65f1"
  }
}
```
字段说明
|字段|类型|说明|样例|是否必需|
|:---:|:---:|:---:|:---:|:---:|
|contact_id|string|联系人ID|5a2f9d59a0c1b022d89277f2|是|
|phone|string|中国大陆11位手机号|18827046729|是|
|name|string|人名，1-10个字符|abc|是|
|email|string|邮件地址|test@gmail.com|否|

### 错误码
|错误码|说明|
|:---:|:---:|
|600|请求参数无效|


## Get All Contact

### HTTP Method

```
[Get]
```

### Path

```
/contacts
```

### Post Body

```
NULL
```

### Respnose

```
{
  "RESULT": [{
      "phone": "15127109243",
      "name": "name1",
      "email": "name1@email.com",
      "contact_id": "5a2fa038874a0e1afc9a65f1"
    },
    {
      "phone": "17753549170",
      "name": "name2",
      "email": "name2@email.com",
      "contact_id": "5a2fa038874a0e1afc9a65f2"
    }
    ......]
}
```

### Error

无

## Update Contact

### HTTP Method

```
[Put]
```

### Path

```
/contacts/:contact_id
```

### Post Body

```
{
    "name": "newname1",
    "phone": "15187043754",
    "email": "newname1@email.com"
}
```

### Respnose

```
{
	"message": "Update Success"
}
```

### Error
无

## Delete Contact

### HTTP Method

```
[DELETE]
```

### Path

```
/contacts/:contact_id
```

### Post Body
```
{
    "contact_id": "5a2fa038874a0e1afc9a65f1"
}
```

### Respnose

```
{
	"message": "Delete Success"
}
```

### Error
无