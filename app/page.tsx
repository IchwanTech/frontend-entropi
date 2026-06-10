import { redirect } from "next/navigation";

const Home = () => {
  redirect("/orders");
};

export default Home;
