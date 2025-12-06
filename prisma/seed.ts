import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const tasks = [
  // Frontend Development - Week 1
  {
    title: "Learn React Fundamentals",
    description: "Understand components, props, and state management basics",
    difficulty: "starter",
    estimatedMinutes: 45,
    careerTrack: "frontend",
    phase: "fundamentals",
    day: 1,
    order: 1,
    resourceUrl: "https://react.dev/learn",
  },
  {
    title: "Build a Simple Counter App",
    description: "Practice useState hook by building an interactive counter",
    difficulty: "focus",
    estimatedMinutes: 60,
    careerTrack: "frontend",
    phase: "fundamentals",
    day: 1,
    order: 2,
    resourceUrl: "https://react.dev/learn/tutorial-tic-tac-toe",
  },
  {
    title: "Setup TypeScript in React",
    description: "Configure TypeScript and understand basic type annotations",
    difficulty: "deep",
    estimatedMinutes: 90,
    careerTrack: "frontend",
    phase: "fundamentals",
    day: 2,
    order: 1,
    resourceUrl: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/",
  },
  {
    title: "Learn CSS Flexbox",
    description: "Master flexbox layout patterns for responsive designs",
    difficulty: "focus",
    estimatedMinutes: 50,
    careerTrack: "frontend",
    phase: "fundamentals",
    day: 2,
    order: 2,
    resourceUrl: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
  },

  // Data Science - Week 1
  {
    title: "Python Data Types & Structures",
    description: "Learn lists, dictionaries, and data manipulation basics",
    difficulty: "starter",
    estimatedMinutes: 40,
    careerTrack: "data",
    phase: "fundamentals",
    day: 1,
    order: 1,
  },
  {
    title: "Introduction to Pandas",
    description: "Load CSV files and perform basic data exploration",
    difficulty: "focus",
    estimatedMinutes: 60,
    careerTrack: "data",
    phase: "fundamentals",
    day: 1,
    order: 2,
    resourceUrl: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/",
  },
  {
    title: "Data Cleaning Techniques",
    description: "Handle missing values, duplicates, and outliers",
    difficulty: "deep",
    estimatedMinutes: 75,
    careerTrack: "data",
    phase: "fundamentals",
    day: 2,
    order: 1,
    resourceUrl: "https://www.kaggle.com/learn/data-cleaning",
  },
  {
    title: "Basic Data Visualization",
    description: "Create charts using Matplotlib and understand when to use each type",
    difficulty: "focus",
    estimatedMinutes: 55,
    careerTrack: "data",
    phase: "fundamentals",
    day: 2,
    order: 2,
    resourceUrl: "https://matplotlib.org/stable/tutorials/introductory/pyplot.html",
  },

  // Cloud & DevOps - Week 1
  {
    title: "Linux Command Line Basics",
    description: "Master essential shell commands and file navigation",
    difficulty: "starter",
    estimatedMinutes: 35,
    careerTrack: "cloud",
    phase: "fundamentals",
    day: 1,
    order: 1,
    resourceUrl: "https://ryanstutorials.net/linuxtutorial/",
  },
  {
    title: "Docker Fundamentals",
    description: "Understand containers, images, and Dockerfile basics",
    difficulty: "focus",
    estimatedMinutes: 70,
    careerTrack: "cloud",
    phase: "fundamentals",
    day: 1,
    order: 2,
    resourceUrl: "https://docs.docker.com/get-started/",
  },
  {
    title: "Deploy a Simple Web App",
    description: "Deploy a containerized app to a cloud platform",
    difficulty: "deep",
    estimatedMinutes: 90,
    careerTrack: "cloud",
    phase: "fundamentals",
    day: 2,
    order: 1,
    resourceUrl: "https://docs.digitalocean.com/developer-center/deploy-container-app/",
  },
  {
    title: "Learn Git Workflow",
    description: "Practice branching, merging, and pull requests",
    difficulty: "focus",
    estimatedMinutes: 50,
    careerTrack: "cloud",
    phase: "fundamentals",
    day: 2,
    order: 2,
    resourceUrl: "https://git-scm.com/docs/gittutorial",
  },

  // Frontend - Days 3-5
  { title: "Component Composition Patterns", description: "Learn how to build reusable React components", difficulty: "focus", estimatedMinutes: 55, careerTrack: "frontend", phase: "fundamentals", day: 3, order: 1, resourceUrl: "https://react.dev/learn/passing-props-to-a-component" },
  { title: "State Management with useReducer", description: "Handle complex state logic in React", difficulty: "deep", estimatedMinutes: 70, careerTrack: "frontend", phase: "fundamentals", day: 3, order: 2, resourceUrl: "https://react.dev/reference/react/useReducer" },
  { title: "API Integration with Fetch", description: "Learn to fetch and display data from REST APIs", difficulty: "focus", estimatedMinutes: 60, careerTrack: "frontend", phase: "tools", day: 4, order: 1, resourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" },
  { title: "Form Handling & Validation", description: "Build forms with controlled inputs and validation", difficulty: "focus", estimatedMinutes: 65, careerTrack: "frontend", phase: "tools", day: 4, order: 2, resourceUrl: "https://react-hook-form.com/get-started" },
  { title: "CSS Grid Layouts", description: "Create complex page layouts with CSS Grid", difficulty: "starter", estimatedMinutes: 45, careerTrack: "frontend", phase: "tools", day: 5, order: 1, resourceUrl: "https://css-tricks.com/snippets/css/complete-guide-grid/" },
  { title: "Build a Todo App", description: "Combine React hooks, forms, and state management", difficulty: "deep", estimatedMinutes: 90, careerTrack: "frontend", phase: "projects", day: 5, order: 2, resourceUrl: "https://react.dev/learn/thinking-in-react" },

  // Data - Days 3-5
  { title: "Statistical Analysis Basics", description: "Learn mean, median, mode, and standard deviation", difficulty: "starter", estimatedMinutes: 50, careerTrack: "data", phase: "fundamentals", day: 3, order: 1, resourceUrl: "https://www.khanacademy.org/math/statistics-probability" },
  { title: "Data Aggregation with Pandas", description: "Master groupby, pivot tables, and aggregations", difficulty: "focus", estimatedMinutes: 65, careerTrack: "data", phase: "fundamentals", day: 3, order: 2, resourceUrl: "https://pandas.pydata.org/docs/user_guide/groupby.html" },
  { title: "Advanced Visualizations", description: "Create interactive plots with Seaborn and Plotly", difficulty: "focus", estimatedMinutes: 60, careerTrack: "data", phase: "tools", day: 4, order: 1, resourceUrl: "https://seaborn.pydata.org/tutorial.html" },
  { title: "Time Series Analysis", description: "Work with datetime data and trends", difficulty: "deep", estimatedMinutes: 75, careerTrack: "data", phase: "tools", day: 4, order: 2, resourceUrl: "https://www.analyticsvidhya.com/blog/2018/02/time-series-forecasting-methods/" },
  { title: "SQL Fundamentals", description: "Learn SELECT, WHERE, JOIN, and GROUP BY", difficulty: "focus", estimatedMinutes: 55, careerTrack: "data", phase: "tools", day: 5, order: 1, resourceUrl: "https://mode.com/sql-tutorial/introduction-to-sql/" },
  { title: "Analyze Real Dataset", description: "Complete end-to-end analysis on real-world data", difficulty: "deep", estimatedMinutes: 90, careerTrack: "data", phase: "projects", day: 5, order: 2, resourceUrl: "https://www.kaggle.com/learn/data-analysis" },

  // Cloud - Days 3-5
  { title: "CI/CD Pipeline Basics", description: "Set up automated testing and deployment", difficulty: "focus", estimatedMinutes: 60, careerTrack: "cloud", phase: "tools", day: 3, order: 1, resourceUrl: "https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions" },
  { title: "Infrastructure as Code", description: "Learn Terraform or CloudFormation basics", difficulty: "deep", estimatedMinutes: 80, careerTrack: "cloud", phase: "tools", day: 3, order: 2, resourceUrl: "https://developer.hashicorp.com/terraform/intro" },
  { title: "Monitoring & Logging", description: "Set up application monitoring and log aggregation", difficulty: "focus", estimatedMinutes: 55, careerTrack: "cloud", phase: "tools", day: 4, order: 1, resourceUrl: "https://grafana.com/docs/grafana/latest/fundamentals/" },
  { title: "Container Orchestration", description: "Introduction to Kubernetes concepts", difficulty: "deep", estimatedMinutes: 75, careerTrack: "cloud", phase: "tools", day: 4, order: 2, resourceUrl: "https://kubernetes.io/docs/tutorials/kubernetes-basics/" },
  { title: "Security Best Practices", description: "Learn about secrets management and secure deployments", difficulty: "starter", estimatedMinutes: 40, careerTrack: "cloud", phase: "tools", day: 5, order: 1, resourceUrl: "https://owasp.org/www-project-top-ten/" },
  { title: "Deploy Multi-Container App", description: "Deploy a full-stack application with Docker Compose", difficulty: "deep", estimatedMinutes: 90, careerTrack: "cloud", phase: "projects", day: 5, order: 2, resourceUrl: "https://docs.docker.com/compose/gettingstarted/" },
];

const achievements = [
  {
    type: "streak",
    title: "First Steps",
    subtitle: "Completed your first learning day",
    description: "You've taken the first step in your learning journey",
    icon: "trophy",
    requirement: JSON.stringify({ type: "days_completed", count: 1 }),
  },
  {
    type: "streak",
    title: "Consistency Champion",
    subtitle: "Logged in for 3 consecutive days",
    description: "Building a strong learning habit",
    icon: "flame",
    requirement: JSON.stringify({ type: "streak_days", count: 3 }),
  },
  {
    type: "completion",
    title: "Task Master",
    subtitle: "Completed 10 tasks",
    description: "You're making steady progress",
    icon: "check-circle",
    requirement: JSON.stringify({ type: "tasks_completed", count: 10 }),
  },
  {
    type: "project",
    title: "Builder",
    subtitle: "Completed your first project",
    description: "From learning to building - great work!",
    icon: "code",
    requirement: JSON.stringify({ type: "projects_completed", count: 1 }),
  },
];

async function main() {
  console.log("Starting seed...");

  // Clear existing data
  console.log("Clearing existing tasks and achievements...");
  await prisma.taskProgress.deleteMany();
  await prisma.task.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();

  // Seed tasks
  console.log("Seeding tasks...");
  for (const task of tasks) {
    await prisma.task.create({
      data: task,
    });
  }
  console.log(`Created ${tasks.length} tasks`);

  // Seed achievements
  console.log("Seeding achievements...");
  for (const achievement of achievements) {
    await prisma.achievement.create({
      data: achievement,
    });
  }
  console.log(`Created ${achievements.length} achievements`);

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
