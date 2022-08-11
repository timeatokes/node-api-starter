# Node API Starter
A project aimed at providing scaffolding for a new NodeJS API Project and some reference on how the standard project should be structured.

For anything not covered in this file and especially for NodeJS best practices we recommend [nodebestpractices](https://github.com/goldbergyoni/nodebestpractices#3-code-style-practices) repo.

### Table of Contents
1. [Quick Start](#markdown-header-quick-start)
2. [Scripts](#markdown-header-scripts)
3. [Folder Structure](#markdown-header-folder-structure)
4. [API Documentation](#markdown-header-api-documentation)
5. [Modules](#markdown-header-modules)
6. [Testing](#markdown-header-testing)
7. [Exception handling](#markdown-header-exception-handling)
8. [Validation](#markdown-header-validation)

### Quick Start
Prerequisites:

 - [git](https://git-scm.com/)
 - [node](https://nodejs.org/en/)
 - [nvm](https://github.com/creationix/nvm) (recommended tool to support multiple versions of node simultaneously)
 - [yarn](https://yarnpkg.com/) (npm install -g yarn)
```
git clone git@bitbucket.org:rbl-ciprianiacob/node-api-starter.git
cd node-api-starter
nvm use
yarn
```

### Scripts

 - `yarn start:ts` | Starts the project without watchers for the dev environment. This command should be used on the local environment as it uses the TS files
 - `yarn start:watch` | Similar to yarn start:ts but rebuilds every time changes are made
 - `yarn build` | Transpiles the TypeScript files into the `./dist/` bundle
 - `yarn start` | Starts the transpiled and bundled project from `./dist/`
 - `yarn eslint` | Runs the linter and prettier
 - `yarn prettier` | Runs the prettier
 - `yarn swagger` | Generated the Swagger docs that can be accessed at `/docs`
 - `yarn test` | Run the unit tests suite
 - `yarn test:coverage` | Runs the unit tests suite and returns the Code Coverage report


### Folder Structure

```
node-api-starter/
├─ ...
├─ index.ts
├─ modules/
│  ├─ index.ts
│  ├─ user/
|  |  ├─ tests/
|  |  |  ├─ get-user.test.ts
│  │  ├─ user.router.ts
│  │  ├─ user.controller.ts
│  │  ├─ user.service.ts
│  │  ├─ user.dal.ts
│  │  ├─ user.models.ts
├─ database/
│  ├─ connection.ts
├─ models/      # Reusable Models
|  ├─ user.ts
├─ toolkit/     # Services or reusable logic
|  ├─ tests/
|  |  ├─ auth.middleware.test.ts
|  ├─ common-functionality.ts
|  ├─ auth.middleware.ts
```
Each module should be completely separated from the others (no module should import another module).

Any common functionality should be extracted in the toolkit, including the middlewares.

### API Documentation
In order to access the swagger documentation:

```
yarn run swagger    // Generated the swagger.json file
yarn start:ts       // Start the server
```
After building the documentation and starting the server, go to the /docs page.

#### Generate documentation
In order to generate the Swagger documentation for your endpoint, this [documentation](https://tsoa-community.github.io/docs/descriptions.html#endpoint-descriptions) should be used as reference.

 - Each controller should use the `@Router()` decorator to specify a new controller.

 - Each method on the Controller should use the `@Get()`, `@Post()`, `@Put()` or `@Delete()` decorators to define the methods used.

### Modules

Each module should contain the following files:

#### Router

The `router`, as the name suggest should route the request to the appropriate `controller`.
In the router you should also include any middlewares specific for that request (e.g. authentication middleware or request validation).

#### Controller

The `controller` are used to get the required data from the _request_, _path_ and _body_ and send it to the proper service.
It's also where we set up the `tsoa` decorators that will define the Swagger docs. 

#### Service

The `service` contains most of the endpoint's logic. This is the part of the endpoint that orchestrates what happens with the data returned from the database.

#### DAL (Data Access Layer)

The `services` should only be used to move data between the **app** and the **db** or **3rd party services**.

The `service` methods should be as granular as possible, each of them having as few tasks as possible. This limits the ammount of logic contained in them and ensures that they are as reusable as possible within their module.

#### Model

The `model` is the place to store everything strictly related to this `module's` data. Some examples of this type of data:

- Specific endpoint response type
- Types specific to the controller

Any models that are used in different parts of the application should be moved in `./models`.

### Testing

#### Principles

- Unit-testing is done using `Jest`
- For any toolkit function, the coverage should be `medium-high`, preferably as close to 100% as possible.
- For any Controllers, the coverage should be `medium`, the aim should be to test the critical paths of the functionality, not necessarily the coverage. It would still be recommended to get around `50%-60%` overall.

#### Structure

For the `toolkit`, every test file should be in the `./toolkit/tests`. The naming convention is `example.middleware.test.ts`.

For the `controllers`, for each controller, the tests should be split by method and be placed in `./modules/example/test/`. The naming convention is `method-name.test.ts`.

Every test suite should be wrapped in a `describe`, defining the scope of the tests. This will make them a lot easier to read and easier to spot tests that fail.

```
describe('UserController - Get User', () => {
    test('should return the correct user', () => { ... })
})
```

### Exception handling

No exception should be left uncaught.
We catch exceptions in 2 layers for every module: Controller and DAL.

Catching an exception in the DAL layer should return null most of the time, so when we get a null in the service we know it is probably a database query issue.
Catching an exception in the Controller layer should mean logging the exception and returning an object containing the exception,


#### How to create responses

We use a helper class called "ResposeFactory" for handling reponse creation in the controller.
This class has a set of static methods for creating different types of exceptions or a standard response.

Each controller method should return a ControllerResponse object. A ControllerResponse object is just an object containing 2 fiels: status code and body.
We only create ControllerResponse objects inside the ResponseFactory class, so each return in your controller method should look something like this: return ResponseFactory.createResponse(your data)
This means you don't have to worry about the status code as it is handled inside ResponseFactory, you just have to pass the data you want to send.
Also, your data can be of any type, you just have to pass the type to the ControllerResponse like this: ControllerResponse<'Type of your response'>

Because we usually can get either an OK response or some error responses from a controller method, the return type will usually look like this:

```
public static async controllerMethod(some params): ControllerResponse<'Your OK response type' | ControllerError>
```

The body of an error should always be a ControllerError, which is just a type containing a message and an error code

The message is used for easier understanding of the error when working on the front-end.
The error code will be used on the front-end to display the error in a specific way.

When creating errors with ResponseFactory, every error type has a default message and error code. For example, the default message for a 404 error will be "Not found" and the default error code will be "NOT-FOUND".
This will probably be enough most of the times, but we can also pass custom messages and error codes like this:

```
ResponseFactory.createSomeError('my custom message', 'my custom error code')
```

These 2 parameters are optional but sometimes useful. The message parameter can be any string, while the error code parameter should be of type ErrorCode. This is just an enum to keep them all together. If you can't find an already declared ErrorCode that suits your needs, you can just add another new one in the enum. This enum lives in toolkit/responseFactory.ts

### Validation

In order to validate the request body [express-validator](https://express-validator.github.io/docs/) is used.

You can find examples in the documentation or in the _*.validators.ts_ inside any of the modules.

It's recommended to use the validators as middlewares on each route you need validation.

#### Use _validation.reporter.ts_ from the _toolkit_ to report the errors found

By including the _validationReporter_ as the last element of the validation array, any errors found will be returned to the user.


