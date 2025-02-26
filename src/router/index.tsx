import { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Chatbot from "../components/chatbot/Chatbot";
import routes from "./config";
import { Styles } from "../styles/styles";

const Router = () => {
  // Get API key from environment variables
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
  
  return (
    <Suspense fallback={null}>
      <Styles />
      <Header />
      <Switch>
        {routes.map((routeItem) => {
          return (
            <Route
              key={routeItem.component}
              path={routeItem.path}
              exact={routeItem.exact}
              component={lazy(() => import(`../pages/${routeItem.component}`))}
            />
          );
        })}
      </Switch>
      <Footer />
      <Chatbot apiKey={apiKey} />
    </Suspense>
  );
};

export default Router;
