import React, { Component } from 'react'
import { extend } from 'lodash'
import { SearchkitManager, SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination,
  HitsStats, SortingSelector, NoHits,
  ResetFilters, Hits,
  InputFilter, GroupedSelectedFilters, RangeFilter,
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar } from 'searchkit'
import './index.css'

const searchkit = new SearchkitManager("/")

const StudyHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://apps.who.int/trialsearch/Trial2.aspx?TrialID=" + encodeURIComponent(result._source.id)
  const source:any = extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("details")}>
        <a href={url} target="_blank"><h2 className={bemBlocks.item("title")}>{source.public_title}</h2></a>
        <h3 className={bemBlocks.item("subtitle")}>{source.id}, registered {source.date_registered}</h3>
        <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.plot}}></div>
      </div>
    </div>
  )
}

class App extends Component {
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
            <InputFilter id="secondary_ids" searchThrottleTime={500} title="Secondary IDs" placeholder="..." searchOnChange={true} queryFields={["secondary_ids"]} />
            <RangeFilter
              id="date_registered"
              field="date_registered"
              title="Date registered"
              min={631152000 * 1000}
              max={new Date(new Date().getFullYear() + 1, 0, 1).getTime()}
              interval={31556952 * 1000}
              rangeFormatter={(time) => (new Date(time).getUTCFullYear())}
              showHistogram={true} />
            <RefinementListFilter id="recruitment_status" title="Recruitement status" field="recruitment_status" operator="OR" size={10}/>
            <RefinementListFilter id="registry" title="Registry" field="registry" operator="OR" size={10}/>
            <RefinementListFilter id="country" title="Country" field="countries" operator="OR" size={10}/>
            <RefinementListFilter id="country_non_standard" title="Other geographic name" field="countries_non_standard" operator="OR" size={10}/>
            <RefinementListFilter id="study_type" title="Study type" field="study_type" operator="OR" size={10}/>
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

export default App;
