import React, { useState, useEffect } from "react";
import { ThemeProvider, Typography, Box, Stack } from "@mui/material";
import NavigationBar from "../../components/NavigationBar";
import AppTheme from "../../util/Theme";
import MobileNav from "../../components/Mobile/MobileNav";
import { motion } from "framer-motion";
import LightSpeed from "react-reveal/LightSpeed";
import Slide from "react-reveal/Slide";
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
              <Slide left cascade collapse>
                <Typography variant="h2">Welcome to LinkedList</Typography>
              </Slide>
              <br></br> <br></br> <br></br>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3 }}
              >
                <Typography variant="h4" paddingTop={2}>
                  a social media platform designed exclusively for individuals
                  in the tech industry. Just like LinkedIn, but tailored
                  specifically for tech enthusiasts, LinkedList provides a
                  powerful platform for tech professionals to showcase their
                  skills, build connections, and enhance their career prospects.
                </Typography>
              </motion.div>
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
              <Typography variant="h3">Key Features</Typography>
              <ul style={{ textAlign: "center" }}>
                <Stack spacing={2}>
                  <LightSpeed left cascade collapse>
                    <Typography variant="h5">
                      <li>
                        Comprehensive Profiles: Create a detailed profile
                        highlighting your educational background, profession,
                        experience, and a captivating bio that tells your unique
                        story.
                      </li>
                    </Typography>
                  </LightSpeed>

                  <LightSpeed left cascade collapse>
                    <Typography variant="h5">
                      <li>
                        Project Showcase: Showcase your personal projects, side
                        hustles, and open-source contributions with visually
                        stunning project displays. Let the world see your coding
                        prowess.
                      </li>
                    </Typography>
                  </LightSpeed>

                  <LightSpeed left cascade collapse>
                    <Typography variant="h5">
                      <li>
                        Resume Display: Upload your resume and make it easily
                        accessible to potential employers. LinkedList ensures
                        that your talent shines through.
                      </li>
                    </Typography>
                  </LightSpeed>

                  <LightSpeed left cascade collapse>
                    <Typography variant="h5">
                      <li>
                        Engaging Blog Posts: Share your thoughts, insights, and
                        expertise with the community through captivating blog
                        posts. Inspire others, spark discussions, and grow your
                        professional network.
                      </li>
                    </Typography>
                  </LightSpeed>

                  <LightSpeed left cascade collapse>
                    <Typography variant="h5">
                      <li>
                        Career Opportunities: Explore a wide range of job
                        opportunities posted by reputable tech companies. Stay
                        updated with the latest career prospects in the
                        ever-evolving tech industry.
                      </li>
                    </Typography>
                  </LightSpeed>

                  <LightSpeed left cascade collapse>
                    <Typography variant="h5">
                      <li>
                        Networking and Collaboration: Connect with like-minded
                        tech professionals, form collaborations, and exchange
                        knowledge. LinkedList is your gateway to building
                        meaningful professional relationships.
                      </li>
                    </Typography>
                  </LightSpeed>
                </Stack>
              </ul>
            </Box>
          </Stack>
        </Box>
        <br></br>
        <Footer />
      </ThemeProvider>
    </div>
  );
}

export default Landing;
