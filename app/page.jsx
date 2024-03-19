import Feed from "@components/Feed";

function Home() {
  return (
    <section className="w-full flex-center flex-col">
        <h1 className="head_text text-center">Discover & share
        <br className="max-md:hidden"/>
        <span className="orange_gradient text-center">Blogs</span>
        </h1>
        <p className="desc text-center">
           Blogtopia is an open-source tool for modern world to
           discover, create and share creative blogs.
        </p>
        <Feed/>
    </section>
  )
}

export default Home 