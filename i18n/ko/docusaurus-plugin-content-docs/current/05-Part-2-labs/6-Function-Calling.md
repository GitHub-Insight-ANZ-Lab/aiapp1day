<head>
  <body className="navigation-with-keyboard ko" />
</head>

# 펑션 콜링

:::note 일러두기
이 페이지는 기계 번역을 통해 한국어로 번역했습니다. 어색한 표현이 있을 수 있으니 양해 바랍니다.
:::

:::tip 펑션 콜링이란 무엇인가요? 
GPT-3.5 및 GPT-4 모델은 사용자 정의 펑션을 입력으로 받아 구조화된 출력을 생성할 수 있습니다.
:::

최신 버전의 gpt-35-turbo 및 gpt-4는 함수와 함께 작동하도록 미세 조정되었으며 함수를 호출해야 하는 시기와 방법을 모두 결정할 수 있습니다. 요청에 하나 이상의 함수가 포함된 경우 모델은 프롬프트의 컨텍스트에 따라 함수를 호출해야 하는지 여부를 결정합니다. 모델이 함수를 호출해야 한다고 판단하면 함수에 대한 인수를 포함한 JSON 객체로 응답합니다.

모델은 사용자가 지정한 함수를 기반으로 API 호출을 공식화하고 데이터 출력을 구조화합니다. 중요한 점은 모델이 이러한 호출을 생성할 수는 있지만, 이를 실행하는 것은 사용자의 몫이므로 사용자가 계속 제어할 수 있다는 것입니다.

함수 작업은 크게 세 단계로 나눌 수 있습니다:

- 함수와 사용자의 입력으로 채팅 완료 API를 호출합니다.
- 모델의 응답을 사용하여 API 또는 함수를 호출합니다.
- 함수의 응답을 포함하여 채팅 완료 API를 다시 호출하여 최종 응답을 얻습니다.

### 시스템 메시지

먼저 시스템 메시지를 업데이트합니다. 

- 이 시스템 메시지에서 어시스턴트의 목표를 설명합니다.
- 수집해야 하는 정보를 설명합니다.
- 모든 정보가 수집되면 어떤 함수를 사용할지 설명하세요.

```text title="시스템 메시지"
You are an AI assistant that helps people find hotels. 
In the conversation with the user, your goal is to retrieve the required fields for the function search_hotels.
```

### OpenAI 펑션

두 번째로 OpenAI 함수 함수 필드에 아래 json을 붙여넣습니다.

함수에는 이름, 설명, 파라미터의 세 가지 주요 매개변수가 있습니다.

설명: 함수를 언제 어떻게 호출할지 결정하기 위한 것이므로 함수가 하는 일에 대한 의미 있는 설명을 제공하는 것이 중요합니다.

파라미터: 함수가 허용하는 매개변수를 설명하는 JSON 스키마 객체입니다.

```json title="Functions"
[{
  "name": "search_hotels",
  "description": "Retrieves hotels from the search index based",
  "parameters": {
    "type": "object",             
    "properties": {
      "location": {
        "type": "string",
        "description": "The location of the hotel (i.e. Seattle, WA)"
      },
      "price": {
        "type": "number",
        "description": "The maximum price for the hotel"
      },
      "features": {
        "type": "string",
        "description": "A comma separated list of features (i.e. beachfront, free wifi, etc.)"
      }
     },
    "required": ["location","price","features"]
  }
}]
```

### 대화

이제 상담원과 대화를 시작해 보겠습니다.

물어보세요:

```text title="사용자 메시지"
네덜란드에 있는 호텔을 찾고 있어요.
```

상담원은 위치, 가격 및 호텔 기능에 대해 질문하기 시작하고 마지막으로 함수를 호출하여 숙소를 json 형식으로 반환해야 합니다. 

:::info 숙제
함수를 확장하여 객실의 수용 인원을 물어봅니다.
:::
