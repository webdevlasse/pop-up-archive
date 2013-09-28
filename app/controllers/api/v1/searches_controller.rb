class Api::V1::SearchesController < Api::V1::BaseController

  expose :search_result do; end

  def show
    query_builder = QueryBuilder.new(params, current_user)
    page = params[:page].to_i

    tire_results = Tire.search('items') do
      if page.present? && page > 1
        from (page - 1) * RESULTS_PER_PAGE
      end
      size RESULTS_PER_PAGE

      query_builder.query do |q|
        query &q
      end

      query_builder.facets do |my_facet|
        facet my_facet.name, &my_facet
      end

      query_builder.filters do |my_filter|
        filter my_filter.type, my_filter.value
      end

      highlight transcript: { number_of_fragments: 0 }
    end.results

    self.search_result = ItemResultsPresenter.new(tire_results)

    respond_with :api, search_result
  end

  def recent
    query_builder = QueryBuilder.new(params, current_user)
    list_size = params[:size] ? params[:size].to_i : 6

    self.search_result = ItemResultsPresenter.new(Tire.search(index_name) do
    
      query_builder.query do
        string '*'
      end
      
      sort {by :created_at, 'desc'}
      
      size list_size
    
    end.results)
    
    respond_with :api, search_result
  end
  
  def explore
    my_letter = params[:letter]
    my_facet = params[:facet]
    #get alphabetical tire results with term and count only
    self.search_result = Tire.search index_name, my_facet => 'count' do 
      query {string my_facet.to_s + ':' + my_letter + '*'}
        facet my_facet.to_s do
          terms my_facet, :order => 'term'
      end
       
    end.results  
    respond_with :api, search_result
  end
  
  def top_terms
    my_facet =  params[:facet]
    self.search_result = Tire.search index_name, my_facet => 'count' do
      query {string my_facet.to_s + ':*'}
        facet my_facet.to_s do
          terms my_facet
      end
      
    end.results  
    respond_with :api, search_result
  end 
      
    else
  
  private

  def index_name
    if current_user.present? && current_user.id == 1 && Tire.index('items_st').exists?
      @debug = true
      'items_st'
    else
      'items'
    end
  end
    
end
