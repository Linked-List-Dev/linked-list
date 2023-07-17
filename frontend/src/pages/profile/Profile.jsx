import React from "react";
import { useState } from "react";
import NavigationSidePanel from "../../components/NavigationSidePanel";
import AppTheme from "../../util/Theme";
import {
  Box,
  Typography,
  ThemeProvider,
  Stack,
  Paper,
  Avatar,
} from "@mui/material";
import Post from "../../components/Post";

const placeholder = [
  {
    postId: 1,
    userName: "Maserati Bugatti",
    jobTitle: "Software Engineer",
    profilePhoto:
      "https://www.catster.com/wp-content/uploads/2017/11/Mackerel-Tabby-cat.jpg.optimal.jpg",
    description:
      "Im a professional sleeper if you need someone to sleep and catch mice please comment!!",
    numLikes: 400,
  },
  {
    postId: 2,
    userName: "Maserati Bugatti",
    jobTitle: "Certified Lover Boy",
    profilePhoto:
      "https://www.catster.com/wp-content/uploads/2017/11/Mackerel-Tabby-cat.jpg.optimal.jpg",
    description: "Who wanna hire me?",
    numLikes: 1,
  },
  {
    postId: 3,
    userName: "Maserati Bugatti",
    jobTitle: "Certified Lover Boy",
    profilePhoto:
      "https://www.catster.com/wp-content/uploads/2017/11/Mackerel-Tabby-cat.jpg.optimal.jpg",
    description: "Somebody please give me a job dawg.",
    numLikes: 10,
  },
];

const placeholderBio = `
🔹 Welcome to my profile! I'm Maserati Bugatti, a highly skilled software engineer with a strong passion for developing cutting-edge applications and systems. With a proven track record of delivering high-quality software solutions, I thrive in fast-paced and dynamic environments.

🔹 Expertise: I specialize in full-stack development, leveraging my proficiency in languages such as Java, Python, and JavaScript. I'm well-versed in frameworks like Angular and React, and I have hands-on experience with various databases and cloud technologies.

🔹 Problem Solver: I love tackling complex challenges and finding efficient solutions. Whether it's optimizing code performance, improving user experiences, or implementing scalable architectures, I enjoy applying my problem-solving skills to create robust software solutions.

🔹 Collaboration: As a dedicated team player, I believe in the power of collaboration and effective communication. I thrive in cross-functional teams, valuing diverse perspectives and actively contributing to a positive and supportive work environment.

🔹 Continuous Learning: The tech industry is constantly evolving, and I'm committed to staying up-to-date with the latest advancements. I actively participate in conferences, workshops, and online courses to enhance my knowledge and keep my skill set current.

🔹 Achievements: I have successfully delivered several high-impact projects throughout my career, including [mention notable projects or accomplishments]. These experiences have honed my ability to adapt quickly, meet deadlines, and deliver exceptional results.

🔹 If you're looking for a driven and dedicated software engineer who can effectively contribute to your team's success, feel free to reach out. Let's connect and explore potential collaborations!
`;

function Profile() {
  const [userName, setUserName] = useState("Maserati Bugatti");
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [biography, setBiography] = useState(placeholderBio);
  const [posts, setPosts] = useState(placeholder);
  const [profileImage, setProfileImage] = useState(placeholder[0].profilePhoto);
  const [headPhoto, setHeaderPhoto] = useState(
    "https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?cs=srgb&dl=pexels-chait-goli-1796730.jpg&fm=jpg"
  );

  return (
    <div>
      <ThemeProvider theme={AppTheme}>
        <Box sx={{ display: "flex", backgroundColor: "page.secondary" }}>
          <NavigationSidePanel />

          <Box
            sx={{
              flex: 1,
              paddingLeft: "2vw",
              paddingRight: "2vw",
              paddingTop: "2vh",
            }}
          >
            {/* Here goes the profile stuff*/}
            <Stack spacing={5}>
              <Box>
                <Box
                  bgcolor={"accent.main"}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    backgroundImage: `url(${headPhoto})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    padding: "2vh 2vw 2vw 2vh",
                    borderRadius: "10px",
                    minHeight: "20vh",
                  }}
                >
                  <Avatar
                    src={profileImage}
                    sx={{
                      width: 150,
                      height: 150,
                      border: "white 4px solid",
                      borderColor: "page.main",
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="h4">About Me</Typography>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: "page.main",
                    height: "auto",
                    padding: "2vh 2vw 2vw 2vh",
                    borderRadius: "10px",
                  }}
                >
                  <Typography color={"text.secondary"}>{biography}</Typography>
                </Paper>
              </Box>

              <Box>
                <Typography variant="h4">Posts</Typography>
                <Stack spacing={3}>
                  {posts.map((post) => (
                    <Post
                      key={post.postId}
                      _postId={post.postId}
                      _userName={post.userName}
                      _jobTitle={post.jobTitle}
                      _profilePhoto={post.profilePhoto}
                      _description={post.description}
                      _numLikes={post.numLikes}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default Profile;
