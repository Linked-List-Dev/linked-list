import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeProvider, Typography, Box, Stack } from "@mui/material";
import NavigationBar from "../../components/NavigationBar";
import AppTheme from "../../util/Theme";
import MobileNav from "../../components/Mobile/MobileNav";
import { motion } from "framer-motion";
import LightSpeed from "react-reveal/LightSpeed";
import Fade from "react-reveal/Fade";
import { Card, CardContent, IconButton, Button } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const cardData = [
  {
    title: "Comprehensive Profiles",
    content: `Create a detailed profile
  highlighting your educational background, profession,
  experience, and a captivating bio that tells your unique
  story.`,
  },
  {
    title: "Project Showcase",
    content: `Showcase your personal projects, side
  hustles, and open-source contributions with visually
  stunning project displays. Let the world see your coding
  prowess.`,
  },
  {
    title: "Resume Display",
    content: `Upload your resume and make it easily
  accessible to potential employers. LinkedList ensures that
  your talent shines through.`,
  },
  {
    title: "Engaging Blog Post",
    content: `Share your thoughts, insights, and
  expertise with the community through captivating blog posts.
  Inspire others, spark discussions, and grow your
  professional network.`,
  },
  {
    title: "Career Opportunities",
    content: `Explore a wide range of job
  opportunities posted by reputable tech companies. Stay
  updated with the latest career prospects in the
  ever-evolving tech industry.`,
  },
  {
    title: "Networking and Collaboration",
    content: `Connect with like-minded tech
  professionals, form collaborations, and exchange knowledge.
  LinkedList is your gateway to building meaningful
  professional relationships.`,
  },
  // Add more card data as needed
];

function Landing() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === cardData.length - 1 ? 0 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === cardData.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Box
      style={{
        backgroundColor: "#F6F6F6",
        maxHeight: "100vh",
        overflow: "scroll",
      }}
    >
      <ThemeProvider theme={AppTheme}>
        {windowWidth >= 850 ? (
          <Box width={"100vw"} maxHeight={"100vh"}>
            <NavigationBar />
            <Box>
              <Box minWidth={"100vw"} color={"text.main"}>
                <Stack
                  direction="row"
                  paddingTop={"10vh"}
                  height="100%"
                  spacing={5}
                  paddingBottom={5}
                >
                  <Box
                    justifyContent="center"
                    alignItems="center"
                    width={"48vw"}
                    paddingLeft={"2vw"}
                    textAlign={"center"}
                    color={"text.main"}
                  >
                    <Fade top>
                      <Typography variant="h2">
                        Welcome to LinkedList
                      </Typography>
                    </Fade>
                    <Fade>
                      <Typography variant="h5" paddingTop={"3vh"}>
                        a tech-focused social platform
                        designed for tech enthusiasts. Similar to LinkedIn,
                        LinkedList lets tech professionals showcase skills,
                        build connections, and boost careers. Connect with
                        like-minded tech experts, share knowledge through
                        articles, and network with potential collaborators. Stay
                        updated on industry trends and engage with influential
                        personalities and companies. Join our vibrant community
                        to enhance your tech career. Discover, connect, and
                        thrive with LinkedList.
                      </Typography>
                    </Fade>
                  </Box>
                  <Box
                    sx={{
                      width: "48vw",
                      paddingRight: "2vw",
                      minHeight: "50vh",
                      overflow: "hidden",
                      textAlign: "center",
                    }}
                  >
                    <Fade top>
                      <Typography variant="h2">Key Features</Typography>
                    </Fade>
                    <Box
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        paddingTop: "3vh",
                      }}
                    >
                      <IconButton
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "10px",
                          transform: "translateY(-50%)",
                        }}
                        onClick={handlePrev}
                      >
                        <ChevronLeftIcon />
                      </IconButton>
                      <Box
                        style={{
                          transition: "transform 0.5s ease",
                          transform: `translateX(-${activeIndex * 100.6}%)`,
                        }}
                      >
                        <Stack direction={"row"} spacing={3}>
                          {cardData.map((card, index) => (
                            <Box
                              key={index}
                              style={{
                                flex: "0 0 100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Card
                                style={{
                                  width: "40vw",
                                  height: "35vh",
                                  textAlign: "left",
                                }}
                              >
                                <CardContent>
                                  <Typography variant="h4">
                                    {card.title}
                                  </Typography>
                                  <Typography
                                    variant="h5"
                                    color={"text.secondary"}
                                    paddingTop={2}
                                  >
                                    {card.content}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                      <IconButton
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "10px",
                          transform: "translateY(-50%)",
                        }}
                        onClick={handleNext}
                      >
                        <ChevronRightIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              <Box
                width={"100vw"}
                minHeight={"20vh"}
                sx={{
                  background: "linear-gradient(to top, #9398FC, #6858D8)",
                }}
              >
                <Box
                  paddingTop={5}
                  alignContent={"center"}
                  textAlign={"center"}
                >
                  <Button
                    component={Link}
                    to="/feed"
                    variant="outlined"
                    sx={{
                      color: "white",
                      borderColor: "white",
                      position: "relative",
                      "&:hover": {
                        "&::before, &::after": {
                          content: '""',
                          position: "absolute",
                          top: "0",
                          right: "0",
                          bottom: "0",
                          left: "0",
                          border: "2px solid white",
                          borderRadius: "4px", // Optional: Adjust the border radius to match the button
                        },
                        "&::before": {
                          transform: "translate(-4px, -4px)", // Adjust for border thickness
                        },
                        "&::after": {
                          transform: "translate(4px, 4px)", // Adjust for border thickness
                        },
                      },
                    }}
                  >
                    <Typography variant="h4"> Start Exploring Now</Typography>
                  </Button>
                </Box>

                <Box
                  sx={{
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#cfcaca",
                    bottom: 0,
                    width: "100%",
                    paddingBottom: "1rem",
                  }}
                >
                  <Typography paddingTop={"2vh"}>
                    © {new Date().getFullYear()} Flores & Kolpakov. All rights
                    reserved.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box width={"100vw"}>
            <MobileNav />
            <Box>
              <Box minWidth={"100vw"} color={"text.main"}>
                <Stack
                  paddingTop={"10vh"}
                  height="100%"
                  spacing={5}
                  paddingBottom={10}
                >
                  <Box
                    justifyContent="center"
                    alignItems="center"
                    width={"100vw"}
                    paddingLeft={"2vw"}
                    textAlign={"center"}
                    color={"text.main"}
                  >
                    <Fade top>
                      <Typography variant="h2">
                        Welcome to LinkedList
                      </Typography>
                    </Fade>
                    <Fade>
                      <Typography variant="h5" padding={"3vh"}>
                        Welcome to LinkedList, a tech-focused social platform
                        designed for tech enthusiasts. Similar to LinkedIn,
                        LinkedList lets tech professionals showcase skills,
                        build connections, and boost careers. Connect with
                        like-minded tech experts, share knowledge through
                        articles, and network with potential collaborators. Stay
                        updated on industry trends and engage with influential
                        personalities and companies. Join our vibrant community
                        to enhance your tech career. Discover, connect, and
                        thrive with LinkedList.
                      </Typography>
                    </Fade>
                  </Box>
                  <Box
                    sx={{
                      width: "100vw",
                      paddingRight: "2vw",
                      minHeight: "50vh",
                      overflow: "hidden",
                      textAlign: "center",
                    }}
                  >
                    <Fade top>
                      <Typography variant="h2">Key Features</Typography>
                    </Fade>
                    <Box
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        paddingTop: "3vh",
                      }}
                    >
                      <IconButton
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "10px",
                          transform: "translateY(-50%)",
                        }}
                        onClick={handlePrev}
                      >
                        <ChevronLeftIcon />
                      </IconButton>
                      <Box
                        style={{
                          transition: "transform 0.5s ease",
                          transform: `translateX(-${activeIndex * 100.6}%)`,
                        }}
                      >
                        <Stack direction={"row"} spacing={3}>
                          {cardData.map((card, index) => (
                            <Box
                              key={index}
                              style={{
                                flex: "0 0 100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Card
                                style={{
                                  width: "70vw",
                                  height: "35vh",
                                  textAlign: "left",
                                }}
                              >
                                <CardContent>
                                  <Typography variant="h4">
                                    {card.title}
                                  </Typography>
                                  <Typography
                                    variant="h5"
                                    color={"text.secondary"}
                                    paddingTop={2}
                                  >
                                    {card.content}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                      <IconButton
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "10px",
                          transform: "translateY(-50%)",
                        }}
                        onClick={handleNext}
                      >
                        <ChevronRightIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              <Box
                width={"100vw"}
                minHeight={"21vh"}
                sx={{
                  background: "linear-gradient(to top, #9398FC, #6858D8)",
                }}
              >
                <Box
                  paddingTop={5}
                  alignContent={"center"}
                  textAlign={"center"}
                >
                  <Button
                    component={Link}
                    to="/feed"
                    variant="outlined"
                    sx={{
                      color: "white",
                      borderColor: "white",
                      position: "relative",
                      "&:hover": {
                        "&::before, &::after": {
                          content: '""',
                          position: "absolute",
                          top: "0",
                          right: "0",
                          bottom: "0",
                          left: "0",
                          border: "2px solid white",
                          borderRadius: "4px", // Optional: Adjust the border radius to match the button
                        },
                        "&::before": {
                          transform: "translate(-4px, -4px)", // Adjust for border thickness
                        },
                        "&::after": {
                          transform: "translate(4px, 4px)", // Adjust for border thickness
                        },
                      },
                    }}
                  >
                    <Typography variant="h4"> Start Exploring Now </Typography>
                  </Button>
                </Box>

                <Box
                  sx={{
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#cfcaca",
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    paddingBottom: "1rem",
                  }}
                >
                  <Typography paddingTop={"2vh"}>
                    © {new Date().getFullYear()} Flores & Kolpakov. All rights
                    reserved.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </ThemeProvider>
    </Box>
  );
}

export default Landing;
