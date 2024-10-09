# 명시적인 repository layer 가 없는, 3 tiered layered architecture

## 개요

- 일반적으로 3 tier layer 라고 하면, controller / service / repository 가 있습니다.
- 그러나 이번 구현한 부분에선 repository layer 가 존재하지 않습니다. ORM 이 그 역할을 대신 하고 있습니다.

## ORM

> From a developer's perspective, an ORM allows you to work with database-backed data using the same object-oriented structures and mechanisms you'd use for any type of internal data. The promise of ORMs is that you won't need to rely on special techniques or necessarily learn a new querying language like SQL to be productive with your data - [What is an ORM? Prisma](https://www.prisma.io/dataguide/types/relational/what-is-an-orm)

[여러분들이 프로젝트를 하실 때 사용하시는 ORM 인 Prisma 가 설명한 ORM](https://www.prisma.io/dataguide/types/relational/what-is-an-orm) 입니다. 간단히 요약하자면, 여러분이 사용하시는 프로그래밍 언어를 통해 데이터베이스를 조작하는 역할을 담당하는 게 ORM 입니다.

# Structure of 3 tiered layer

| Layer      | Description                                                                                        | Responsibilities                                                                                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Controller | Handles incoming HTTP requests and manages the flow of data between the client and the application | - Receives and validates user input<br>- Calls appropriate service methods<br>- Formats and returns responses to the client<br>- Handles error responses                             |
| Service    | Contains the business logic of the application                                                     | - Implements complex business rules and calculations<br>- Coordinates data access through repositories<br>- Performs data transformations<br>- Manages transactions                  |
| Repository | Abstracts the data access layer and provides an interface for database operations                  | - Handles database queries and operations<br>- Encapsulates data access logic<br>- Provides methods for CRUD operations<br>- Translates between database entities and domain objects |

3 tier layer 를 설명하는 간단한 표를 만들어 봤습니다. 한 파일 혹은 한 함수에서 모든 걸 처리하는 게 아니라, 역할에 따라 계층을 나누는게 3 tier layer architecure 입니다.

```javascript
// account-repository.js
class AccountRepository {
  constructor(
    databaseConnection
  ) {
    this.connection = databaseConnection;
  }

  getACcount({accountId: number}) {
    return await databaseConnection
      .createQueryBuilder("account")
      .select()
      ...
  }
}
```

원래대로라면 해당 역할을 하는 무언가를 하나 만들어주고 해당 요소를 통해서만 데이터베이스에 질의를 해서 데이터를 가져온 뒤 객체라든가 하는 프로그래밍 언어의 개념을 사용해 의미있는 무언가로 변환해주는 과정을 수행하고 이를 넘겨주어야 합니다. 이걸 ORM 을 통해 하는 것이지요.

## 장점과 단점

### 장점

- 간편합니다. 일단 SQL을 모르는 상황에서도 어느정도 사용할 수 있습니다. 그리고 저런 코드도 직접 쓸 필요가 없어집니다. 최고의 장점입니다.

### 단점

- ORM 의 spec 에 종속될 수 있습니다. 그러다보면 테스트가 힘들어집니다. Mongoose 의 schema 등을 이용해 ORM 을 통해 정의한 자료형을 별다른 변환 없이 service layer 에도 올리고, controller layer 에도 올리면 각 계층이 내가 원하는 대로 잘 돌아갔나 테스트를 하는 과정에서 골치가 아파집니다.
  - 이를 해결하기 위해선 명시적인 repository layer 가 필요합니다. 더하여, 해당 repository layer 에서는 ORM 을 통해 데이터를 가져오고, 그 가져온 데이터를 여러분들이 `class` 등을 통해 직접 만든 자료형으로 한 번 변환하여 반환하는 과정이 필요합니다.
- 특정 상황에서 어느 정도의 성능 저하가 발생할 수 있습니다.
  - ORM 은 그 구조상 어쩔 수 없이 [N+1 problem](https://planetscale.com/blog/what-is-n-1-query-problem-and-how-to-solve-it) 이라는, 많이 유명한 문제를 가지고 있습니다. 이게 어떤 문제인지 따로 정리해 보시는 걸 정말 권장드립니다.
  - 이를 해결하기 위한 방법도 여러 가지가 있습니다. ORM 에서의 설정을 통해서 해결할 수도 있고, read 연산을 하는 query 일 경우 query builder 등을 사용해 N+1 문제를 피하는 방법도 있을 겁니다. 이것도 같이 알아보시길 권장 드립니다. 
