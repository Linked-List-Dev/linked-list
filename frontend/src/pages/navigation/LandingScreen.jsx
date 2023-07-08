import React from 'react';
import Welcome from '../../components/Welcome';
import NavigationBar from '../../components/NavigationBar'

function Landing() {
  return (
    <div>
        <NavigationBar/>
        <h1>LinkedList</h1>
        <Welcome />
    </div>
  );
}

export default Landing;