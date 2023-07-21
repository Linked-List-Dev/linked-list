
function NewPost({}){
    return(
        <Modal
                    open={open}
                    onClose={handleClose}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <Box
                        sx={{
                            backgroundColor: "page.main",
                            borderRadius: 5,
                            width: "40vw",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                        }}>
                        <Box
                            paddingTop="3vh"
                            paddingBottom="3vh">
                            <Stack
                                spacing={5}
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                paddingTop="2vh"
                                paddingBottom="2vh">

                                <form onSubmit={handleSubmit}>
                                    <Stack alignItems={'center'} spacing={3}>
                                        <Typography variant='h3' color='accent.main'>
                                            New Post
                                        </Typography>
                                        <TextField
                                            sx={{ width: '30vw' }}
                                            multiline
                                            rows={5}
                                            variant='outlined'
                                            name='content'
                                            label="What's on your mind?"
                                            value={formValues.content}
                                            onChange={handleChange}
                                            fullWidth
                                            required />

                                        <Button
                                            type='submit'
                                            variant='contained'
                                            size='large'
                                            sx={{
                                                backgroundColor: "accent.main",
                                                textTransform: "none",
                                                borderRadius: 4,
                                                width: "7vw",
                                                height: "auto",
                                                "&:hover": {
                                                    backgroundColor: "accent.secondary",
                                                },
                                            }}>
                                            <Typography variant='h4'>
                                                Post!
                                            </Typography>
                                        </Button>
                                    </Stack>


                                </form>
                            </Stack>

                        </Box>
                    </Box>
                </Modal>
    )
}