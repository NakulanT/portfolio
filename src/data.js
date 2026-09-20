// All site content lives here. Add or edit links, projects and stats in one place.

export const profile = {
  name: 'Nakulan T',
  role: 'AI Engineer',
  location: 'Chennai, India',
  email: 'nakulan.thirukumar@gmail.com',
  company: 'Grootan Technologies',
};

// Add more profiles here (Medium, Kaggle, Hugging Face, X ...) and they show up automatically.
export const links = [
  { label: 'GitHub', handle: '@NakulanT', href: 'https://github.com/NakulanT', icon: 'github' },
  { label: 'LinkedIn', handle: 'in/nakulant', href: 'https://www.linkedin.com/in/nakulant/', icon: 'linkedin' },
  { label: 'LeetCode', handle: 'u/nakulant', href: 'https://leetcode.com/u/nakulant/', icon: 'leetcode' },
  { label: 'Email', handle: 'nakulan.thirukumar@gmail.com', href: 'mailto:nakulan.thirukumar@gmail.com', icon: 'mail' },
];

export const stats = [
  { value: 30, prefix: '~', suffix: ' FPS', label: 'real-time vision across multiple streams' },
  { value: 4, suffix: '', label: 'Grafana dashboards tracking agent token usage' },
  { value: 98, suffix: '%', label: 'LBW decision accuracy from one 2D camera' },
  { value: 93.59, suffix: '%', decimals: 2, label: 'cattle identification accuracy' },
];

export const marquee = [
  'AWS Bedrock AgentCore', 'Strands Agents', 'LangChain', 'RAG', 'Guardrails', 'SageMaker',
  'PyTorch', 'YOLO', 'DeepStream', 'TensorRT', 'ONNX', 'OpenCV', 'OpenTelemetry', 'Grafana',
  'CloudWatch', 'FastAPI', 'React', 'TypeScript',
];

export const work = [
  {
    id: 'vision',
    art: 'vision',
    title: 'Real-time computer vision platform',
    problem: 'Face, plate and OCR analytics had to run on many video streams without dropping frames.',
    solution:
      'A configurable plugin pipeline for detection, tracking, face recognition, license plates and OCR that holds ~30 FPS with chained plugins across multiple streams.',
    tags: ['DeepStream', 'TensorRT', 'ONNX', 'OpenCV'],
  },
  {
    id: 'dance',
    art: 'pose',
    title: 'GenAI features for a dance app',
    problem: 'Onboarding had to feel personal, and learners needed feedback on their poses.',
    solution:
      'A personalised plan and a recommendation plan for every new user, plus pose validation over video landmark data turned into actionable feedback.',
    tags: ['Strands Agents', 'Bedrock AgentCore'],
  },
  {
    id: 'observability',
    art: 'observability',
    title: 'LLM observability',
    problem: 'AI agents were a black box for cost and behaviour.',
    solution:
      'Traces and custom metrics with 4 Grafana dashboards (home, user, session, turn) showing token usage by human, tool and agent.',
    tags: ['CloudWatch', 'OpenTelemetry', 'Grafana'],
  },
  {
    id: 'rag',
    art: 'rag',
    title: 'Medical RAG application',
    problem: 'Answers in a medical setting had to be relevant and safe.',
    solution:
      'Tuned chunking and retrieval with LangChain on AgentCore so answers stay relevant, and designed sync and async guardrails that block unsafe and out-of-scope responses.',
    tags: ['LangChain', 'AgentCore', 'Guardrails'],
  },
  {
    id: 'tracking',
    art: 'chat',
    title: 'Project-tracking assistant',
    problem: 'Managers checked Jira, YouTrack and Zoho People separately to see hours and status.',
    solution:
      'An agent with tool calling over Jira, YouTrack and Zoho People, so managers simply ask in plain language and get live answers, plus automated billing reports.',
    tags: ['Strands Agents', 'Tool calling'],
  },
  {
    id: 'keycloak',
    art: 'keycloak',
    title: 'Identity and access with Keycloak',
    problem: 'Sign-in had to match the customer\'s brand, and existing users had to move over safely.',
    solution:
      'Branded Keycloak login, OTP, SMS, email and account themes with Keycloakify, a Spring Boot bulk user migrator (CSV upload, thread pool) and unit tests for an IAM extension.',
    tags: ['Keycloak', 'Keycloakify', 'Spring Boot'],
  },
  {
    id: 'flutter',
    art: 'flutter',
    title: 'Employee engagement app',
    problem: 'Employees needed one place for recognition, points, rewards and company news.',
    solution:
      'Helped plan the first release and designed the HR admin experience, then built the Flutter app foundation: dev and prod flavors, BLoC state management, secure sign-in, Sentry monitoring and GitLab CI with automated tests.',
    tags: ['Flutter', 'BLoC', 'Sentry', 'GitLab CI'],
  },
  {
    id: 'cattle',
    art: 'cattle',
    title: 'Cattle behaviour monitoring',
    problem: 'Manual observation and electronic tags are slow, costly and error-prone for tracking herd health.',
    solution:
      'Two YOLOv8 models recognise standing, lying and eating and identify each animal from coloured stickers, feeding a React dashboard with trends and alerts. 93.59% identification accuracy, +3.5% over prior models.',
    tags: ['YOLOv8', 'PyTorch', 'Flask', 'React'],
  },
  {
    id: 'lbw',
    art: 'lbw',
    title: 'LBW decision system',
    problem: 'LBW calls are subjective and hard to verify without expensive multi-camera setups.',
    solution:
      'Tracks the ball with YOLOv8 from a single 2D camera, finds the pitch and impact points, extends the path to the stumps and overlays pitching, impact and wickets on the video. 98% accuracy.',
    tags: ['YOLOv8', 'OpenCV', 'FastAPI'],
  },
];

export const principles = [
  {
    n: '01',
    title: 'Start with the problem',
    text: 'Before any model or framework, I pin down who is stuck, what it costs them and how we will know it worked.',
  },
  {
    n: '02',
    title: 'Design the whole experience',
    text: 'Onboarding flows, agent responses, dashboards, interfaces. A model is only useful when the people around it can understand and trust it.',
  },
  {
    n: '03',
    title: 'Make it observable and maintainable',
    text: 'Traces, metrics, guardrails and clean hand-offs, so the team can run, debug and improve it long after launch.',
  },
];

export const stack = [
  { group: 'GenAI & agents', items: ['AWS Bedrock AgentCore', 'Strands Agents', 'LangChain', 'RAG', 'Tool calling', 'Guardrails', 'Prompt engineering'] },
  { group: 'ML & vision', items: ['PyTorch', 'TensorFlow', 'YOLO', 'OpenCV', 'DeepStream', 'TensorRT', 'ONNX'] },
  { group: 'AWS & MLOps', items: ['SageMaker', 'Bedrock', 'Glue', 'ECS/ECR', 'CloudWatch', 'IAM', 'KMS'] },
  { group: 'Observability', items: ['Grafana', 'OpenTelemetry', 'CloudWatch'] },
  { group: 'Build', items: ['Python', 'TypeScript', 'SQL', 'FastAPI', 'Flask', 'React', 'Docker', 'Git'] },
];

export const timeline = [
  {
    when: 'Apr 2025 – Present',
    title: 'AI Engineer',
    org: 'Grootan Technologies',
    text: 'Agentic GenAI on AWS Bedrock AgentCore, LLM observability and real-time computer vision.',
  },
  {
    when: 'Jan 2024 – Mar 2025',
    title: 'Machine Learning Intern',
    org: 'iGrads Labs',
    text: 'Built a cattle behaviour monitoring system and a cricket LBW decision app with YOLO, PyTorch and OpenCV.',
  },
  {
    when: '2021 – 2025',
    title: 'B.Tech, Artificial Intelligence & Data Science',
    org: 'Nandha Engineering College',
    text: 'CGPA 7.9',
  },
];

export const projects = [
  { name: 'Cattle Behaviour Analysis', stack: 'YOLOv8 · PyTorch · Flask · React', note: '93.59% identification accuracy', href: 'https://github.com/NakulanT/Cattle-behaviour-analysis' },
  { name: 'LBW Decision System', stack: 'YOLOv8 · OpenCV · FastAPI · React Native', note: '98% accuracy from one 2D camera', href: 'https://github.com/NakulanT/2D-DRS' },
  { name: 'Chennai House Price Prediction', stack: 'Python · XGBoost · Scikit-learn · Flask', note: 'Kaggle dataset', href: 'https://github.com/NakulanT/Chennai-house-price-prediction' },
  { name: 'E-commerce Site', stack: 'React · Flask · MongoDB · Neo4j', note: 'Full-stack store', href: 'https://github.com/NakulanT/E-Commerse' },
  { name: 'Real-time Chat', stack: 'React · Firebase · OAuth', note: 'Search users and chat securely', href: 'https://github.com/NakulanT/whatsapp-clone' },
  { name: 'Anonymous Chat Room', stack: 'React · Firebase Firestore', note: 'Rooms with IDs and passwords', href: 'https://github.com/NakulanT/Chat-room' },
  { name: 'Tic Tac Toe AI', stack: 'Python · Flask · Min-Max', note: 'Unbeatable computer player', href: 'https://github.com/NakulanT/Tic-Tac-Toe' },
  { name: 'Medical E-commerce', stack: 'React · Node.js · MongoDB Atlas', note: 'Freelance delivery', href: 'https://github.com/NakulanT/Medical-shop' },
];
