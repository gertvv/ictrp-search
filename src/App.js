import React, { Component } from 'react'
import { extend } from 'lodash'
import { SearchkitManager, SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination,
  HitsStats, SortingSelector, NoHits,
  ResetFilters, Hits,
  InputFilter, GroupedSelectedFilters,
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar } from 'searchkit'
import { DateRangeFilter } from "searchkit-daterangefilter"
import { Router, Route, Link, Redirect, browserHistory } from 'react-router';
import './index.css'

const searchkit = new SearchkitManager("/")

const StudyHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  const id = encodeURIComponent(result._source.id)
  const source:any = extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("details")}>
        <Link to={"/view/" + id}><h2 className={bemBlocks.item("title")}>{source.public_title}</h2></Link>
        <h3 className={bemBlocks.item("subtitle")}>{source.id}, registered {source.date_registered}</h3>
        <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.plot}}></div>
      </div>
    </div>
  )
}

class Search extends Component {
  render() {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <div className="my-logo"></div>
            <SearchBox autofocus={true} searchOnChange={true} prefixQueryFields={["public_title", "scientific_title", "acronym"]}/>
          </TopBar>

          <LayoutBody>

          <SideBar>
            <InputFilter id="conditions" searchThrottleTime={500} title="Conditions" placeholder="..." searchOnChange={true} queryFields={["health_conditions.description"]} />
            <InputFilter id="outcomes" searchThrottleTime={500} title="Outcomes" placeholder="..." searchOnChange={true} queryFields={["outcomes.description"]} />
            <InputFilter id="interventions" searchThrottleTime={500} title="Interventions" placeholder="..." searchOnChange={true} queryFields={["interventions.description"]} />
            <DateRangeFilter 
              id="date_registered"
              field="date_registered"
              title="Date registered"
              min={1990} 
              max={new Date().getFullYear()} 
              interval="year"
              showHistogram={true} />
            <RefinementListFilter id="recruitment_status" title="Recruitement status" field="recruitment_status" operator="OR" size={10}/>
            <RefinementListFilter id="registry" title="Registry" field="registry" operator="OR" size={10}/>
            <RefinementListFilter id="country" title="Country" field="countries" operator="OR" size={10}/>
          </SideBar>
          <LayoutResults>
            <ActionBar>

              <ActionBarRow>
                <HitsStats translations={{
                  "hitstats.results_found":"{hitCount} results found"
                }}/>
                <SortingSelector options={[
                  {label:"Relevance", field:"_score", order:"desc"},
                  {label:"Last registered", field:"date_registered", order:"desc"},
                  {label:"First registered", field:"date_registered", order:"asc"}
                ]}/>
              </ActionBarRow>

              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>

            </ActionBar>
            <Hits
                hitsPerPage={12} highlightFields={["public_title", "scientific_title", "acronym"]}
                sourceFilter={["public_title", "scientific_title", "acronym", "registry", "id", "study_id", "date_registered"]}
                mod="sk-hits-list"
                itemComponent={StudyHitsListItem}
                scrollTo="body"
            />
            <NoHits suggestionsField={"public_title"}/>
            <Pagination showNumbers={true}/>
          </LayoutResults>

          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    );
  }
}

const Outer = (props) => (
  <div>
    <nav>
      <Link activeClassName="active" to="/search">Search</Link>
      <Link activeClassName="active" to="/about">About</Link>
    </nav>
    { props.children }
  </div>
)

const About = () => (
  <Layout>
    <TopBar>
      <div className="my-logo"></div>
      <h1>About</h1>
    </TopBar>
    <LayoutBody>
      <div className="content">
        <h2>Shadow ICTRP</h2>
        <p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?</p>
        <p>On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.</p>
      </div>
    </LayoutBody>
  </Layout>
)

const ViewRecord = (props) => (
  <Layout>
    <TopBar>
      <div className="my-logo"></div>
      <h1>{props.params.id}</h1>
    </TopBar>
    <LayoutBody>
      <div className="content">
      </div>
    </LayoutBody>
  </Layout>
)

const App = () => {
  return (
    <Router history={ browserHistory }>
      <Route path="/" component={ Outer }>
        <Redirect from="/" to="/search"></Redirect>
        <Route path="/search" component={ Search }></Route>
        <Route path="/about" component={ About }></Route>
        <Route path="/view/:id" component={ ViewRecord }></Route>
      </Route>
    </Router>
  )
};

export default App;
