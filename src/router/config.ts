const routes = [
  {
    path: ["/", "/home"],
    exact: true,
    component: "Home",
  },
  {
    path: ["/about"],
    exact: true,
    component: "About",
  },
  {
    path: ["/blog"],
    exact: true,
    component: "Blog",
  },
  {
    path: ["/agents-demo"],
    exact: true,
    component: "AgentsDemo",
  },
  {
    path: ["/agents/:agentType"],
    exact: true,
    component: "AgentInterface",
  },
];

export default routes;
