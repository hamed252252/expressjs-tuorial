import express from "express";
import { query } from "express-validator";
const app = express();

app.use(express.json());

const loggingMidlleware = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next;
};
app.use(loggingMidlleware);

const resolveIndexByUserId = (req, res, next) => {
    const id = req.params.id;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.status(400);
    const findUserIndex = mockUsers.findIndex(
        (user) => user.id === parsedId
    );
    if (findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex;
};
const PORT = process.env.PORT || 3000;
const mockUsers = [
    { id: 1, username: "anson", displayName: "anson" },
    { id: 2, username: "jack", displayName: "jack" },
    { id: 3, username: "dam", displayName: "dam" },
];
app.listen(PORT), () => {};
app.get("/", (req, res) => {
    res.status(201).send({ msg: "hello" });
});

app.get("/api/users/:id", (req, res) => {
    const parsedId = parseInt(req.params.id);

    if (isNaN(parsedId))
        return res
            .status(400)
            .send({ msg: "bad request. In valid Id" });
    const findUser = mockUsers.find(
        (user) => user.id === parsedId
    );
    if (!findUser) return res.sendStatus(404);
    return res.send(findUser);
});
app.put("/api/users/:id", (req, res) => {
    const {
        body,
        params: { id },
    } = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findUserIndex = mockUsers.findIndex(
        (user) => user.id === parsedId
    );
    if (findUserIndex === -1) {
        return res.sendStatus(400);
    }
    mockUsers[findUserIndex] = { id: parsedId, ...body };
    console.log(mockUsers);
    return res.sendStatus(200);
});

app.patch("/api/users/:id", (req, res) => {
    const { body, findIndex } = req;

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findUserIndex = mockUsers.findIndex(
        (user) => user.id === parsedId
    );
    if (findUserIndex === -1) {
        return res.sendStatus(400);
    }
    mockUsers[findUserIndex] = {
        ...mockUsers[findUserIndex],
        ...body,
    };
    return res.sendStatus(200);
});

app.get(
    "/api/users",
    query("filter").isString().notEmpty(),
    (req, res) => {
        const { filter, value } = req.query;

        // If filter and value are undefined, return all users
        if (!filter && !value) return res.send(mockUsers);

        // Validate filter
        if (
            filter &&
            !["id", "username", "displayName"].includes(
                filter
            )
        ) {
            ز;
            return res
                .status(400)
                .send({ msg: "Invalid filter key" });
        }

        // If both filter and value are provided, filter the users
        if (filter && value) {
            return res.send(
                mockUsers.filter((user) =>
                    user[filter]
                        .toString()
                        .includes(value.toString())
                )
            );
        }

        // Default case (shouldn't occur but included for safety)
        return res.send(mockUsers);
    }
);

app.delete(
    "/api/users/:id",
    resolveIndexByUserId,
    (req, res) => {
        mockUsers.splice(req.findUserIndex, 1);
        console.log(mockUsers);
        return res.sendStatus(200);
    }
);

app.post("/api/users", (req, res) => {
    console.log(req.body);
    const { body } = req;
    const newUser = {
        id: mockUsers[mockUsers.length - 1].id + 1,
        ...body,
    };
    mockUsers.push(newUser);
    console.log(mockUsers);
    return res.status(200).send(newUser);
});

app.get("/api/products", (req, res) => {
    res.send([
        { id: 123, name: "chicken brest", price: 12.99 },
        { id: 123, name: "chicken brest", price: 12.99 },
        { id: 123, name: "chicken brest", price: 12.99 },
    ]);
});
