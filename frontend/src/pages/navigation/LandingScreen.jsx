import React, { useState, useEffect } from "react";
import { ThemeProvider, Typography, Button, Box, Stack } from "@mui/material";
import NavigationBar from "../../components/NavigationBar";
import AppTheme from "../../util/Theme";
import IconLight from "../../assets/IconLight.svg";
import MobileNav from "../../components/Mobile/MobileNav";
import Footer from "../../components/Footer";

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

  return (
    <div style={{ backgroundColor: "#FDFCFF", minHeight: "100vh" }}>
      <ThemeProvider theme={AppTheme}>
        {windowWidth >= 768 ? (
          <Box width={"100vw"}>
            <NavigationBar />
          </Box>
        ) : (
          <Box width={"100vw"}>
            <MobileNav />
          </Box>
        )}

        <Box minWidth={"100vw"}>
          <Stack direction="row" paddingTop={"10vh"} height="100%" spacing={5}>
            <Box
              justifyContent="center"
              alignItems="center"
              paddingLeft={"10vw"}
              paddingRight={"10vw"}
              textAlign={"center"}
              color={"text.main"}
            >
              <Typography variant="h2">
                Not your average social media platform
              </Typography>
              <Typography variant="h4" paddingTop={2}>
                Welcome to LinkedList, a social media platform designed
                exclusively for individuals in the tech industry. Just like
                LinkedIn, but tailored specifically for tech enthusiasts,
                LinkedList provides a powerful platform for tech professionals
                to showcase their skills, build connections, and enhance their
                career prospects.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box minWidth={"100vw"} paddingTop={"10vh"}>
          <Stack direction="row" spacing={5}>
            <Box
              justifyContent="center"
              alignItems="center"
              height="100%"
              paddingRight={"10vw"}
              paddingLeft={"10vw"}
              textAlign={"center"}
              color={"text.main"}
            >
              <Typography variant="h2">Key Features</Typography>
              <ul style={{ textAlign: "center" }}>
                <Stack spacing={2}>
                  <Typography variant="h4">
                    <li>
                      Comprehensive Profiles: Create a detailed profile
                      highlighting your educational background, profession,
                      experience, and a captivating bio that tells your unique
                      story.
                    </li>
                  </Typography>

                  <Typography variant="h4">
                    <li>
                      Project Showcase: Showcase your personal projects, side
                      hustles, and open-source contributions with visually
                      stunning project displays. Let the world see your coding
                      prowess.
                    </li>
                  </Typography>

                  <Typography variant="h4">
                    <li>
                      Resume Display: Upload your resume and make it easily
                      accessible to potential employers. LinkedList ensures that
                      your talent shines through.
                    </li>
                  </Typography>

                  <Typography variant="h4">
                    <li>
                      Engaging Blog Posts: Share your thoughts, insights, and
                      expertise with the community through captivating blog
                      posts. Inspire others, spark discussions, and grow your
                      professional network.
                    </li>
                  </Typography>

                  <Typography variant="h4">
                    <li>
                      Career Opportunities: Explore a wide range of job
                      opportunities posted by reputable tech companies. Stay
                      updated with the latest career prospects in the
                      ever-evolving tech industry.
                    </li>
                  </Typography>

                  <Typography variant="h4">
                    <li>
                      Networking and Collaboration: Connect with like-minded
                      tech professionals, form collaborations, and exchange
                      knowledge. LinkedList is your gateway to building
                      meaningful professional relationships.
                    </li>
                  </Typography>
                </Stack>
              </ul>
            </Box>
          </Stack>
        </Box>
        <Footer />
      </ThemeProvider>
    </div>
  );
}

export default Landing;
