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
  Button,
  TextField,
  Modal,
} from "@mui/material";
import Post from "../../components/Post";
import EditIcon from "@mui/icons-material/Edit";

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
    jobTitle: "Software Engineer",
    profilePhoto:
      "https://www.catster.com/wp-content/uploads/2017/11/Mackerel-Tabby-cat.jpg.optimal.jpg",
    description: "Hello everyone this is a post that I made!",
    numLikes: 1,
  }
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

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [formValues, setFormValues] = useState({
    name: "",
    biography: "",
    jobTitle: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  //
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formValues);

    //TODO update profile stuff and state
  };

  return (
    <div>
      <ThemeProvider theme={AppTheme}>
        <Box sx={{ display: "flex", backgroundColor: "page.secondary" }}>
          <NavigationSidePanel position="fixed" />

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
                    borderRadius: "10px",
                    minHeight: "20vh",
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Box sx={{ paddingLeft: "2vw", paddingBottom: "2vh" }}>
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

                    <Button
                      sx={{
                        position: "absolute",
                        bottom: "5px",
                        right: "5px",
                        bgcolor: "white",
                        width: "40px",
                        height: "40px",
                      }}
                      onClick={handleOpen}
                    >
                      <EditIcon fontSize="large" sx={{ color: "black" }} />
                    </Button>
                  </Box>
                </Box>
                <Typography variant="h3" color={"text.main"}>
                  {userName}
                </Typography>
                <Typography variant="h6" color={"text.secondary"}>
                  {jobTitle}
                </Typography>
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

          <Modal
            open={open}
            onClose={handleClose}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                backgroundColor: "page.main",
                borderRadius: 5,
                width: "40vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Box paddingTop="3vh" paddingBottom="3vh">
                <Stack
                  spacing={5}
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  paddingTop="2vh"
                  paddingBottom="2vh"
                >
                  <form onSubmit={handleSubmit}>
                    <Stack alignItems={"center"} spacing={3}>
                      <Typography variant="h3" color="accent.main">
                        Edit Profile
                      </Typography>
                      <TextField
                        sx={{ width: "30vw" }}
                        variant="outlined"
                        name="name"
                        label="Display Name"
                        value={formValues.name}
                        onChange={handleChange}
                        fullWidth
                      />

                      <TextField
                        sx={{ width: "30vw" }}
                        variant="outlined"
                        name="jobTitle"
                        label="Job Title"
                        value={formValues.jobTitle}
                        onChange={handleChange}
                        fullWidth
                      />

                      <TextField
                        sx={{ width: "30vw" }}
                        rows={5}
                        variant="outlined"
                        name="biography"
                        label="Biography"
                        value={formValues.biography}
                        onChange={handleChange}
                        fullWidth
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{
                          backgroundColor: "accent.main",
                          textTransform: "none",
                          width: "auto",
                          height: "auto",
                          "&:hover": {
                            backgroundColor: "accent.secondary",
                          },
                        }}
                      >
                        <Typography variant="h4">Save changes</Typography>
                      </Button>
                    </Stack>
                  </form>
                </Stack>
              </Box>
            </Box>
          </Modal>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default Profile;
