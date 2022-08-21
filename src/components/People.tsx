import axios from "axios";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { Card, Pagination, Navbar, Container, Nav } from "react-bootstrap";
import HeaderLayout from "./HeaderLayout";

const People = () => {
  const [currUsers, setCurrUsers] = useState<any>([]);
  const [maxUsers, setMaxUsers] = useState<number>(0);
  const [activePage, setActivePage] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [me, setMe] = useState<any>({});

  useEffect(() => {
    setIsFetching(true);
  }, [activePage]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4444/users?limit=5&page=${activePage}`
        );
        setCurrUsers(data.users);
        setMaxUsers(data.max);
        setIsFetching(false);
      } catch (e) {
        console.log(e);
      }
    };

    if (isFetching) {
      getUsers();
    }
  }, [isFetching]);

  let items = [];
  for (let number = 1; number <= Math.ceil(maxUsers / 3); number++) {
    items.push(
      <Pagination.Item
        key={number}
        onClick={() => setActivePage(Number(number))}
        active={number === activePage}
      >
        {number}
      </Pagination.Item>
    );
  }

  console.log("items", items);

  const getDate = (date: string) => {
    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let dob = new Date(date);
    let dobnow = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    let age;

    age = today.getFullYear() - dob.getFullYear();

    if (today < dobnow) {
      age = age - 1;
    }

    return age;
  };

  useEffect(() => {
    const cookies = parseCookies();

    const headers = {
      Authorization: `${cookies.token}`,
    };

    const getMe = async () => {
      try {
        const { data } = await axios.get("http://localhost:4444/auth/me", {
          headers: headers,
        });

        console.log("data", data);
        setMe(data);
      } catch (err) {
        console.log("Ошибка при запросе", err);
      }
    };

    getMe();
  }, []);

  return (
    <>
      <HeaderLayout>
        <div>
          <div className="d-flex justify-content-evenly mt-5">
            {currUsers.map((card: any) => {
              if (card.name !== me['name']) {
                return (
                  <Card style={{ width: "18rem" }}>
                    <Card.Img variant="top" src={card.avatarUrl} />
                    <Card.Body>
                      <Card.Title>Имя: {card.name}</Card.Title>
                      <Card.Text>Пароль: (скрыт)</Card.Text>
                      <Card.Text>Возраст: {getDate(card.birthDate)}</Card.Text>
                    </Card.Body>
                  </Card>
                );
              }
            })}
          </div>
          <div className={"d-flex justify-content-center mt-5"}>
            <Pagination>{items}</Pagination>
          </div>
        </div>
      </HeaderLayout>
    </>
  );
};

export default People;
